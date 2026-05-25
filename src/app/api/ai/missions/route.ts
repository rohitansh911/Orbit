import { NextResponse } from "next/server";
import { generateOrbitResponse } from "@/lib/ai";
import { MISSION_PROMPT } from "@/lib/prompts";

const FALLBACK_MISSIONS = [
  { id: "fallback-1", title: "Review Core Concepts", description: "Revisit fundamentals to maintain baseline.", category: "learning", xp: 30, duration: "15m", difficulty: "easy", strategic_reason: "Maintain consistency." },
  { id: "fallback-2", title: "Read Technical Article", description: "Stay current with industry trends.", category: "research", xp: 20, duration: "10m", difficulty: "easy", strategic_reason: "Broaden perspective." },
  { id: "fallback-3", title: "Practice One Problem", description: "Solve a coding challenge at your level.", category: "practice", xp: 40, duration: "20m", difficulty: "medium", strategic_reason: "Sharpen problem-solving." },
];

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ missions: FALLBACK_MISSIONS });
  }

  try {
    const { role, level, skills, momentum, memory } = body;

    const basePrompt = `Generate 3 highly strategic daily missions for this user profile:
Role: ${role || "Engineer"}
Level: ${level || 1}
Core Skills: ${skills?.join(", ") || "None specified"}
Current Momentum: ${momentum || 0}%`;

    const memoryPrompt = memory && memory.length > 0 
      ? `\n\nBEHAVIORAL MEMORY LOG (Critical context for adapting missions):\n${memory.map((m: any) => `- ${m.type}: ${m.context}`).join("\n")}\n\nRULES based on memory: If they are skipping tasks, make the next tasks easier or in a different category. If they have high momentum, push them harder.`
      : `\n\nNo behavioral memory yet. Provide a balanced mix of tasks.`;

    const promptContext = basePrompt + memoryPrompt + `\n\n${MISSION_PROMPT}`;
    const parsedMissions = await generateOrbitResponse(promptContext, true);

    return NextResponse.json({ 
      missions: Array.isArray(parsedMissions) && parsedMissions.length > 0 ? parsedMissions : FALLBACK_MISSIONS 
    });
  } catch (error) {
    return NextResponse.json({ missions: FALLBACK_MISSIONS });
  }
}
