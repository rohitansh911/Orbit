import { NextResponse } from "next/server";
import { generateOrbitResponse } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { query, profileContext } = await req.json();

    const prompt = `
      The user is asking the Orbit Copilot a question: "${query}"
      
      User Context:
      ${JSON.stringify(profileContext)}
      
      Provide a highly strategic, concise, and calm response. Max 3-4 sentences.
      Do not act like a generic assistant. Act like a high-end career telemetry system analyzing their data.
    `;

    const result = await generateOrbitResponse(prompt, false);

    return NextResponse.json({ response: result });
  } catch (error) {
    console.error("Copilot API Error:", error);
    return NextResponse.json({ response: "Telemetry offline. Unable to analyze current context." }, { status: 200 });
  }
}
