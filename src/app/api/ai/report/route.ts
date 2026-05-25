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
  "tone": "positive" | "neutral" | "negative" // determines UI color
}
`;

export async function POST(req: Request) {
  try {
    const { level, momentum, streak, completed, skipped } = await req.json();

    const statsContext = `
      User Stats this week:
      - Level: ${level}
      - Momentum: ${momentum}/100
      - Streak: ${streak} days
      - Completed Missions: ${completed}
      - Skipped Missions: ${skipped}
    `;

    const prompt = REPORT_PROMPT + "\n" + statsContext;
    const result = await generateOrbitResponse(prompt, true);
    // result is now guaranteed to be an Object, not a string
    return NextResponse.json(result);
  } catch (error) {
    console.error("AI Report Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
