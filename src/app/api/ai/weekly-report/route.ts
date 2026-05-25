import { NextResponse } from "next/server";
import { generateOrbitResponse } from "@/lib/ai";

const WEEKLY_REPORT_PROMPT = `
You are Orbit, an advanced career intelligence system.
Generate a structured weekly evolution report based on the user's activity over the past week.

Rules:
1. Tone: Strategic, observant, highly intelligent, premium.
2. Analyze their memory events to identify the strongest area of growth and the weakest area of execution.
3. Keep insights concise and actionable.

Output strictly in this JSON format:
{
  "executiveSummary": "A 2-sentence overarching summary of their week's progression.",
  "strongestGrowth": "Name of the strongest skill or area of growth",
  "weakestDecay": "Name of the most neglected area or skill",
  "readinessDelta": "A short phrase describing market readiness change (e.g., '+15% Technical Depth')",
  "observations": [
    "Observation 1 (e.g., 'Frontend momentum accelerated significantly.')",
    "Observation 2"
  ]
}
`;

export async function POST(req: Request) {
  try {
    const { role, level, xpGained, missionsCompleted, memoryEvents } = await req.json();

    const promptContext = `
      Target Role: ${role || "Engineer"}
      Current Level: ${level || 1}
      XP Gained This Week: ${xpGained || 0}
      Missions Completed: ${missionsCompleted || 0}
      
      Weekly AI Memory Log:
      ${memoryEvents?.length > 0 ? memoryEvents.map((e: any) => `- [${e.type}] ${e.context}`).join("\n") : "No significant activity recorded."}
      
      ${WEEKLY_REPORT_PROMPT}
    `;

    const result = await generateOrbitResponse(promptContext, true);
    return NextResponse.json({ report: result });
  } catch (error) {
    console.error("Weekly Report API Error:", error);
    return NextResponse.json({ error: "Failed to generate weekly report" }, { status: 500 });
  }
}
