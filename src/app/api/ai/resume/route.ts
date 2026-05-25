import { NextResponse } from "next/server";
import { generateOrbitResponse } from "@/lib/ai";
import { RESUME_PROMPT } from "@/lib/prompts";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("resume") as File;
  const role = formData.get("role") as string;
  const memoryEventsStr = formData.get("memoryEvents") as string;
  let memoryEvents: any[] = [];
  if (memoryEventsStr) {
    try { memoryEvents = JSON.parse(memoryEventsStr); } catch {}
  }

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large. Maximum 5MB." }, { status: 400 });
  }

  try {
    let textContent = "";

    if (file.type === "application/pdf") {
      const PDFParser = require("pdf2json");
      const buffer = Buffer.from(await file.arrayBuffer());
      
      textContent = await new Promise<string>((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1);
        
        pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", () => {
          resolve(pdfParser.getRawTextContent());
        });
        
        pdfParser.parseBuffer(buffer);
      });
    } else {
      textContent = await file.text();
    }

    if (!textContent || textContent.trim().length < 50) {
      return NextResponse.json({ error: "Could not extract meaningful text from the file." }, { status: 400 });
    }

    const promptContext = `
      User Target Role: ${role || "Engineer"}
      
      Resume Text:
      """
      ${textContent.substring(0, 10000)}
      """
      
      Recent AI Memory Log (Behavioral Context):
      ${memoryEvents?.length > 0 ? memoryEvents.map((e: any) => `- [${e.type}] ${e.context}`).join("\n") : "No prior trajectory data."}
      
      ${RESUME_PROMPT}
    `;

    const parsedAnalysis = await generateOrbitResponse(promptContext, true);
    
    if (!parsedAnalysis || (Array.isArray(parsedAnalysis) && parsedAnalysis.length === 0)) {
      return NextResponse.json({ error: "AI analysis returned empty. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ analysis: parsedAnalysis });
  } catch (error) {
    console.error("Resume Analysis API Error:", error);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
