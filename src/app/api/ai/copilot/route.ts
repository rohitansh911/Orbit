import { NextResponse } from "next/server";
import { generateOrbitResponse } from "@/lib/ai";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { query, profileContext } = body;
  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Missing 'query' field" }, { status: 400 });
  }

  try {
    const prompt = `
      The user is asking the Orbit Copilot a question: "${query}"
      
      User Context:
      ${JSON.stringify(profileContext || {})}
      
      Provide a highly strategic, concise, and calm response. Max 3-4 sentences.
      Do not act like a generic assistant. Act like a high-end career telemetry system analyzing their data.
    `;

    const result = await generateOrbitResponse(prompt, false);
    return NextResponse.json({ response: result || "Telemetry temporarily offline." });
  } catch (error) {
    return NextResponse.json({ response: "Unable to analyze current context. Please try again." });
  }
}
