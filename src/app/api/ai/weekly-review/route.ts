import { NextResponse } from "next/server";
import { generateOrbitResponse } from "@/lib/ai";

export async function POST(req: Request) {
  let body: Record<string, any>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid body" }, { status: 400 }); }

  const { applications, profile } = body;

  const applied = applications.filter((a: any) => a.status === "applied");
  const interviewing = applications.filter((a: any) => a.status === "interviewing");
  const offers = applications.filter((a: any) => a.status === "offer");
  const rejected = applications.filter((a: any) => a.status === "rejected");
  const saved = applications.filter((a: any) => a.status === "saved");

  const rejectionStages = rejected.map((a: any) => a.rejection_stage).filter(Boolean);
  const rejectionReasons = rejected.map((a: any) => a.rejection_reason).filter(Boolean);
  const warmApps = applications.filter((a: any) => a.source_type === "warm" || a.source_type === "referral");

  const prompt = `You are an expert career coach reviewing a job seeker's weekly progress.

JOB SEEKER PROFILE:
- Target Role: ${profile?.onboardingData?.careerGoal || "Software Engineer"}
- Experience: ${profile?.onboardingData?.currentLevel || "mid"}

THIS WEEK'S PIPELINE:
- Total Applications: ${applied.length}
- Currently Interviewing: ${interviewing.length}
- Offers: ${offers.length}
- Rejected: ${rejected.length}
- Saved (not yet applied): ${saved.length}
- Warm/Referral Applications: ${warmApps.length}

REJECTION DATA:
- Stages rejected at: ${rejectionStages.join(", ") || "not specified"}
- Reasons given: ${rejectionReasons.join(", ") || "no feedback received"}

Respond ONLY with a JSON object (no markdown):
{
  "headline": "<8 words max — honest assessment of this week>",
  "momentum": "accelerating" | "steady" | "stalling" | "stuck",
  "wins": ["<specific win 1>", "<specific win 2>"],
  "concerns": ["<specific concern 1>"],
  "pattern": "<One sharp insight about rejection pattern or conversion rate>",
  "next_week_focus": "<The single most impactful thing to do differently next week>",
  "conversion_rate": <percentage of applications getting interviews, 0-100>,
  "verdict": "<One honest sentence about where they stand in their search>"
}`;

  try {
    const result = await generateOrbitResponse(prompt, true);
    const review = Array.isArray(result) ? result[0] : result;

    const fallback = {
      headline: applied.length === 0 ? "No applications this week" : `${applied.length} applications sent`,
      momentum: applied.length >= 5 ? "accelerating" : applied.length >= 2 ? "steady" : "stalling",
      wins: interviewing.length > 0 ? [`${interviewing.length} active interview${interviewing.length > 1 ? "s" : ""}`] : ["Stayed in the search"],
      concerns: rejected.length > applied.length / 2 ? ["High rejection rate — review your resume targeting"] : [],
      pattern: rejectionStages.length > 0 ? `Rejections happening at: ${rejectionStages[0]}` : "Not enough data yet for pattern detection",
      next_week_focus: saved.length > 3 ? "Stop saving — start applying. Your saved pile is too large." : "Aim for 5+ applications with warm outreach",
      conversion_rate: applied.length > 0 ? Math.round((interviewing.length / applied.length) * 100) : 0,
      verdict: "Keep going — the search is a numbers game with strategy."
    };

    return NextResponse.json({ review: review || fallback });
  } catch {
    return NextResponse.json({ review: null });
  }
}
