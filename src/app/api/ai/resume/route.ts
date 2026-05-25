import { NextResponse } from "next/server";
import { generateOrbitResponse } from "@/lib/ai";
import { RESUME_PROMPT } from "@/lib/prompts";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;
    const role = formData.get("role") as string;
    const memoryEventsStr = formData.get("memoryEvents") as string;
    let memoryEvents = [];
    if (memoryEventsStr) {
      try { memoryEvents = JSON.parse(memoryEventsStr); } catch (e) {}
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    let textContent = "";

    if (file.type === "application/pdf") {
      const PDFParser = require("pdf2json");
      const buffer = Buffer.from(await file.arrayBuffer());
      
      textContent = await new Promise<string>((resolve, reject) => {
        // "1" tells pdf2json we only want raw text content, no styling/layout metadata
        const pdfParser = new PDFParser(null, 1);
        
        pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", () => {
          resolve(pdfParser.getRawTextContent());
        });
        
        pdfParser.parseBuffer(buffer);
      });
    } else {
      // Fallback for docx/txt if parsed differently, or just read text
      textContent = await file.text();
    }

    const promptContext = `
      User Target Role: ${role || "Engineer"}
      
      Resume Text:
      """
      ${textContent.substring(0, 10000)} // limit tokens
      """
      
      Recent AI Memory Log (Behavioral Context):
      ${memoryEvents?.length > 0 ? memoryEvents.map((e: any) => `- [${e.type}] ${e.context}`).join("\n") : "No prior trajectory data."}
      
      ${RESUME_PROMPT}
    `;

    const parsedAnalysis = await generateOrbitResponse(promptContext, true);
    return NextResponse.json({ analysis: parsedAnalysis });
  } catch (error) {
    console.error("Resume Analysis API Error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
