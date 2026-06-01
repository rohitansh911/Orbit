import { NextResponse } from "next/server";
import { generateOrbitResponse } from "@/lib/ai";

const MATCH_PROMPT = `
You are the Orbit Opportunity Intelligence Engine.
Score and analyze job opportunities for a specific user profile.

For each opportunity, generate:
1. match_score: 0-100 integer based on skill overlap, role alignment, experience level
2. skill_gap: The single most critical missing skill (max 4 words)
3. why_match: One sentence explaining why this is a strong match (max 15 words)
4. urgency: "Very High" | "High" | "Medium" | "Low" based on role demand and user readiness

Rules:
- Be specific to the user's actual skills and target role
- Prioritize matches where user has 70%+ skill overlap
- skill_gap should be specific (e.g., "Docker containerization" not "backend skills")
- Score above 85 only if role perfectly aligns with user's stated goal

Output strictly as JSON array:
[
  {
    "id": "<opportunity_id>",
    "match_score": 88,
    "skill_gap": "GraphQL API patterns",
    "why_match": "Your React depth and open-source contributions directly align.",
    "urgency": "High"
  }
]
`;

const RECOMMENDATIONS_PROMPT = `
You are the Orbit AI Career Copilot analyzing a user's job pipeline and profile.
Generate 3 specific, actionable intelligence recommendations based on their current state.

Types: "action" (something to do), "warning" (risk to address), "insight" (strategic observation)

Output strictly as JSON array:
[
  {
    "id": "rec_1",
    "text": "Specific recommendation text (max 20 words)",
    "type": "action" | "warning" | "insight",
    "icon": "material_symbol_name"
  }
]

Valid icon names: terminal, document_scanner, lightbulb, trending_up, school, code, work, psychology
`;

const MARKET_SIGNALS_PROMPT = `
You are the Orbit Market Intelligence Engine.
Generate 4 real, specific market signals relevant to this user's target role and skills.

Output strictly as JSON array:
[
  {
    "id": 1,
    "text": "Signal text (max 8 words, specific and data-driven)",
    "icon": "trending_up" | "architecture" | "bolt" | "forum" | "code" | "school" | "work",
    "trend": "up" | "down" | "neutral"
  }
]
`;

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { opportunities, profile, pipeline, memoryEvents } = body;

  const userContext = `
User Profile:
- Target Role: ${profile?.onboardingData?.careerGoal || "Software Engineer"}
- Current Level: ${profile?.onboardingData?.currentLevel || "fundamentals"}
- Core Skills: ${profile?.onboardingData?.skills?.join(", ") || "Not specified"}
- Biggest Struggles: ${profile?.onboardingData?.struggles?.join(", ") || "Not specified"}
- Dream Companies: ${profile?.onboardingData?.dreamCompanies?.join(", ") || "Not specified"}
- Momentum Score: ${profile?.stats?.momentumScore || 0}%
- Current Level: ${profile?.stats?.level || 1}
- Streak: ${profile?.stats?.streak || 0} days

Pipeline Status:
- Saved: ${pipeline?.saved || 0}
- Applied: ${pipeline?.applied || 0}
- Interviewing: ${pipeline?.interview || 0}
- Offers: ${pipeline?.offer || 0}

Recent Activity:
${memoryEvents?.slice(0, 5).map((e: any) => `- ${e.type}: ${e.context}`).join("\n") || "No recent activity"}
`;

  // Run all 3 AI calls in parallel
  const [scoredOpps, recommendations, marketSignals] = await Promise.allSettled([
    // 1. Score opportunities
    (async () => {
      if (!opportunities?.length) return [];
      const prompt = `${userContext}\n\nOpportunities to score:\n${JSON.stringify(opportunities.map((o: any) => ({ id: o.id, company: o.company, role: o.role, skills_required: o.skills_required, experience_level: o.experience_level })))}\n\n${MATCH_PROMPT}`;
      const result = await generateOrbitResponse(prompt, true);
      return Array.isArray(result) ? result : [];
    })(),

    // 2. Generate recommendations
    (async () => {
      const prompt = `${userContext}\n\n${RECOMMENDATIONS_PROMPT}`;
      const result = await generateOrbitResponse(prompt, true);
      return Array.isArray(result) ? result : [];
    })(),

    // 3. Generate market signals
    (async () => {
      const prompt = `${userContext}\n\n${MARKET_SIGNALS_PROMPT}`;
      const result = await generateOrbitResponse(prompt, true);
      return Array.isArray(result) ? result : [];
    })(),
  ]);

  // Fallback data
  const fallbackScores: any[] = [];
  const fallbackRecs = [
    { id: "rec_1", text: "Complete 3 missions this week to boost your match scores.", type: "action", icon: "terminal" },
    { id: "rec_2", text: "Your profile lacks quantified achievements — add impact metrics.", type: "warning", icon: "document_scanner" },
    { id: "rec_3", text: "Consistent daily activity increases recruiter visibility by 40%.", type: "insight", icon: "lightbulb" },
  ];
  const fallbackSignals = [
    { id: 1, text: "Remote engineering roles up 18% this month", icon: "trending_up", trend: "up" },
    { id: 2, text: "System design depth increasingly prioritized", icon: "architecture", trend: "up" },
    { id: 3, text: "AI-integrated portfolios outperform static resumes", icon: "bolt", trend: "up" },
    { id: 4, text: "Full-stack demand remains consistently high", icon: "code", trend: "neutral" },
  ];

  return NextResponse.json({
    scores: scoredOpps.status === "fulfilled" ? scoredOpps.value : fallbackScores,
    recommendations: recommendations.status === "fulfilled" && recommendations.value.length > 0
      ? recommendations.value : fallbackRecs,
    marketSignals: marketSignals.status === "fulfilled" && marketSignals.value.length > 0
      ? marketSignals.value : fallbackSignals,
  });
}
