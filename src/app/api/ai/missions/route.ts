import { NextResponse } from "next/server";
import { generateOrbitResponse } from "@/lib/ai";
import { MISSION_PROMPT } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
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

    return NextResponse.json({ missions: parsedMissions });
  } catch (error) {
    console.error("Missions API Error:", error);
    // Return a sensible fallback if Gemini fails or is offline
    return NextResponse.json({
      missions: [
        { id: "fallback-1", title: "Review Core Concepts", description: "Offline fallback mission.", category: "learning", xp: 30, duration: "15m", difficulty: "easy", strategic_reason: "Maintain baseline consistency." }
      ]
    }, { status: 200 }); // Status 200 to prevent frontend crashes
  }
}
