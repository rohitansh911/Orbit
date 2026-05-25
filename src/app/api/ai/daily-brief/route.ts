import { NextResponse } from "next/server";
import { generateOrbitResponse } from "@/lib/ai";

const DAILY_BRIEF_PROMPT = `
You are Orbit, an advanced career intelligence system.
Generate a concise, premium daily intelligence briefing for the user based on their history and current stats.

Rules:
1. Tone: Premium, concise, calm, strategic, emotionally aware.
2. Provide a short overarching strategic recommendation.
3. Keep sentences short and punchy.

Output strictly in this JSON format:
{
  "focus": "Today's specific mission focus (e.g., 'Execute backend fundamentals')",
  "momentumAnalysis": "A 1-sentence analysis of their momentum.",
  "warning": "A subtle, non-judgmental warning about stagnation or weakness (or null if none)",
  "recommendation": "1-sentence strategic recommendation."
}
`;

export async function POST(req: Request) {
  try {
    const { role, level, streak, momentum, recentEvents } = await req.json();

    const promptContext = `
      Target Role: ${role || "Engineer"}
      Level: ${level || 1}
      Streak: ${streak || 0} days
      Momentum Score: ${momentum || 0}%
      
      Recent AI Memory Events (last 48h):
      ${recentEvents?.length > 0 ? recentEvents.map((e: any) => `- [${e.type}] ${e.context}`).join("\n") : "None."}
      
      ${DAILY_BRIEF_PROMPT}
    `;

    const result = await generateOrbitResponse(promptContext, true);
    return NextResponse.json({ briefing: result });
  } catch (error) {
    console.error("Daily Brief API Error:", error);
    return NextResponse.json({ error: "Failed to generate daily briefing" }, { status: 500 });
  }
}
