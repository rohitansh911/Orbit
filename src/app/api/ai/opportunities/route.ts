import { NextResponse } from "next/server";
import { generateOrbitResponse } from "@/lib/ai";
import { getPersonalizedPool, generateOpportunityFromCompany } from "@/lib/companies";

const MATCH_PROMPT = `
You are the Orbit Opportunity Intelligence Engine.

For each opportunity, generate a precise intelligence report for THIS specific user.

Output strictly as JSON array. Each element:
{
  "id": "<opportunity_id>",
  "match_score": <0-100 integer>,
  "skill_gap": "<The single most critical missing skill, max 5 words>",
  "why_match": "<One sharp sentence, max 15 words, specific to user's actual skills>",
  "urgency": "Very High" | "High" | "Medium" | "Low",
  "recruiter_alignment": "<One phrase, e.g. 'Strong portfolio fit' or 'Research background needed'>"
}

Scoring rules:
- 90-99: Near perfect role+skill alignment
- 80-89: Strong match, 1-2 gaps
- 70-79: Moderate match, clear gaps
- 60-69: Aspirational but reachable
- Below 60: Don't include

Be specific. "Your Next.js expertise directly targets this role" beats "Good frontend skills".
`;

const RECOMMENDATIONS_PROMPT = `
You are the Orbit AI Career Copilot analyzing a user's career intelligence.

Generate 3 sharp, specific, actionable intelligence items based on their current state.
Each should feel like it came from a senior recruiter or career coach who knows this user.

Types:
- "action": Something specific to do this week
- "warning": A real risk in their current trajectory  
- "insight": A strategic observation about their market position

Output strictly as JSON array:
[
  {
    "id": "rec_1",
    "text": "<max 20 words, specific and actionable>",
    "type": "action" | "warning" | "insight",
    "icon": "<one of: terminal, document_scanner, lightbulb, trending_up, school, code, work, psychology>"
  }
]
`;

const MARKET_SIGNALS_PROMPT = `
You are the Orbit Market Intelligence Engine.
Generate 4 real, specific market signals for this user's target role and skills.
Each signal should feel like live data — not generic advice.

Output strictly as JSON array:
[
  {
    "id": 1,
    "text": "<8 words max, specific trend with implied data>",
    "icon": "trending_up" | "architecture" | "bolt" | "forum" | "code" | "school" | "work",
    "trend": "up" | "down" | "neutral"
  }
]
`;

export async function POST(req: Request) {
  let body: Record<string, any>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { profile, pipeline, memoryEvents } = body;

  // ── Generate personalized company pool from registry ──────────────────
  const targetRole: string = profile?.onboardingData?.careerGoal || "Software Engineer";
  const skills: string[] = profile?.onboardingData?.skills || [];
  const struggles: string[] = profile?.onboardingData?.struggles || [];

  const companyPool = getPersonalizedPool({
    skills,
    careerGoal: targetRole,
    remotePreference: true,
  }, 8);

  // Convert companies to opportunity objects
  const opportunities = companyPool.map(c => generateOpportunityFromCompany(c, targetRole));

  // ── Build rich user context ────────────────────────────────────────────
  const userContext = `
USER PROFILE:
- Target Role: ${targetRole}
- Skills: ${skills.join(", ") || "Not specified"}
- Struggles / Weaknesses: ${struggles.join(", ") || "Not specified"}
- Dream Companies: ${profile?.onboardingData?.dreamCompanies?.join(", ") || "Not specified"}
- Current Level: ${profile?.onboardingData?.currentLevel || "fundamentals"}
- Momentum Score: ${profile?.stats?.momentumScore || 0}%
- XP Level: ${profile?.stats?.level || 1}
- Streak: ${profile?.stats?.streak || 0} days

PIPELINE STATE:
- Saved: ${pipeline?.saved || 0}
- Applied: ${pipeline?.applied || 0}  
- Interviewing: ${pipeline?.interview || 0}
- Offers: ${pipeline?.offer || 0}

RECENT ACTIVITY:
${memoryEvents?.slice(0, 5).map((e: any) => `- ${e.type}: ${e.context}`).join("\n") || "No recent activity"}
`;

  // ── Run all AI tasks in parallel ──────────────────────────────────────
  const [scoredResult, recsResult, signalsResult] = await Promise.allSettled([
    // 1. Match score opportunities
    (async () => {
      const oppSummary = opportunities.map(o => ({
        id: o.id,
        company: o.company,
        role: o.role,
        skills_required: o.skills_required,
        tags: o.tags,
      }));
      const prompt = `${userContext}\n\nOPPORTUNITIES TO SCORE:\n${JSON.stringify(oppSummary)}\n\n${MATCH_PROMPT}`;
      const result = await generateOrbitResponse(prompt, true);
      return Array.isArray(result) ? result : [];
    })(),

    // 2. Generate career recommendations
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

  // ── Merge scores into opportunities ──────────────────────────────────
  const scores: any[] = scoredResult.status === "fulfilled" ? scoredResult.value : [];
  const scoreMap = new Map(scores.map((s: any) => [s.id, s]));

  const enrichedOpportunities = opportunities
    .map(opp => {
      const score = scoreMap.get(opp.id);
      if (!score || score.match_score < 60) return null;
      return {
        ...opp,
        match_score: score.match_score,
        skill_gap: score.skill_gap,
        why_match: score.why_match,
        urgency: score.urgency,
        recruiter_alignment: score.recruiter_alignment,
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => (b?.match_score || 0) - (a?.match_score || 0));

  // Fallbacks
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
    opportunities: enrichedOpportunities.length > 0 ? enrichedOpportunities : opportunities.slice(0, 6),
    recommendations: (recsResult.status === "fulfilled" && (recsResult.value as any[]).length > 0) ? recsResult.value : fallbackRecs,
    marketSignals: (signalsResult.status === "fulfilled" && (signalsResult.value as any[]).length > 0) ? signalsResult.value : fallbackSignals,
  });
}
