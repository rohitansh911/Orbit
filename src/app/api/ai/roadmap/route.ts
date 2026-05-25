import { NextResponse } from "next/server";
import { generateOrbitResponse } from "@/lib/ai";

const ROADMAP_PROMPT = `
You are the Orbit Career Navigation Engine.
Generate a structured, 3-phase strategic career roadmap for this user based on their current momentum and target role.

Rules:
1. Tone: Premium, strategic, intelligent, concise.
2. Phase 1 must focus on immediate foundational gaps or recurring weaknesses identified in their AI Memory Log.
3. Phase 2 must focus on project execution and technical depth.
4. Phase 3 must focus on market readiness, interviewing, and networking.
5. Base the trajectory on their actual momentum and historical execution patterns.

Output strictly in this JSON format:
{
  "summary": "A 2-sentence executive summary of their trajectory.",
  "phases": [
    {
      "id": "phase_1",
      "title": "Phase Title (e.g., Foundation & Systems)",
      "duration": "1-2 Weeks",
      "focus": "The primary objective of this phase",
      "milestones": [
        "Actionable milestone 1",
        "Actionable milestone 2"
      ]
    }
  ]
}
`;

export async function POST(req: Request) {
  try {
    const { role, level, skills, momentum, memoryEvents } = await req.json();

    const promptContext = `
      User Target Role: ${role || "Engineer"}
      Current Level: ${level || 1}
      Current Core Skills: ${skills?.join(", ") || "None specified"}
      Momentum Score: ${momentum || 0}%
      
      Recent AI Memory Log (Behavioral context):
      ${memoryEvents?.length > 0 ? memoryEvents.map((e: any) => `- [${e.type}] ${e.context}`).join("\n") : "No significant history yet."}
      
      ${ROADMAP_PROMPT}
    `;

    const result = await generateOrbitResponse(promptContext, true);
    return NextResponse.json({ roadmap: result });
  } catch (error) {
    console.error("Roadmap API Error:", error);
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
  }
}
