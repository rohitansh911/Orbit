import { generateOrbitResponse } from '@/lib/ai';
import { NextResponse } from 'next/server';

const REPORT_PROMPT = `
You are the intelligence engine of Orbit, a high-end career operating system.
Analyze the user's weekly behavioral data and progression stats to generate a sleek, premium, and emotionally rewarding weekly intelligence briefing.

Input Data:
- Level & XP
- Momentum Score
- Streak Days
- Missions Completed (from memory)
- Missions Skipped (from memory)

Rules for the Report:
1. Tone: Strategic, calm, intelligent, concise, elegant. NO emojis. NO exclamation points unless absolutely necessary. Do NOT sound like a childish video game. Sound like an elite executive coach.
2. Structure: 
   - A short, punchy, 1-2 sentence opening summary (the "insight").
   - A single paragraph of detailed analysis explaining their trajectory.
   - 1 specific area of improvement or tactical advice based on their skipped/weak areas (if any).

Output format MUST be valid JSON:
{
  "insight": "Short punchy summary sentence.",
  "analysis": "The deeper 3-4 sentence paragraph.",
  "tacticalAdvice": "One actionable next step.",
  "tone": "positive" | "neutral" | "negative"
}
`;

const FALLBACK = {
  insight: "Trajectory data processing.",
  analysis: "Insufficient data to generate a full analysis. Continue completing missions to build your behavioral profile.",
  tacticalAdvice: "Complete at least 3 missions this week to unlock a detailed intelligence report.",
  tone: "neutral" as const,
};

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(FALLBACK);
  }

  try {
    const { level, momentum, streak, completed, skipped } = body;

    const statsContext = `
      User Stats this week:
      - Level: ${level || 1}
      - Momentum: ${momentum || 0}/100
      - Streak: ${streak || 0} days
      - Completed Missions: ${completed || 0}
      - Skipped Missions: ${skipped || 0}
    `;

    const prompt = REPORT_PROMPT + "\n" + statsContext;
    const result = await generateOrbitResponse(prompt, true);
    
    return NextResponse.json(result && result.insight ? result : FALLBACK);
  } catch (error) {
    return NextResponse.json(FALLBACK);
  }
}
