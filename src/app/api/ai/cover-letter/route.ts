import { NextResponse } from "next/server";
import { generateOrbitResponse } from "@/lib/ai";

export async function POST(req: Request) {
  let body: Record<string, any>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid body" }, { status: 400 }); }

  const { profile, job } = body;

  const prompt = `You are an expert career coach writing a highly personalized cover letter.

USER PROFILE:
- Name: ${profile?.full_name || "the candidate"}
- Target Role: ${profile?.onboardingData?.careerGoal || "Software Engineer"}
- Skills: ${(profile?.onboardingData?.skills || []).join(", ")}
- Experience Level: ${profile?.onboardingData?.currentLevel || "mid-level"}
- Dream Companies: ${(profile?.onboardingData?.dreamCompanies || []).join(", ")}

JOB DETAILS:
- Company: ${job?.company}
- Role: ${job?.role}
- Required Skills: ${(job?.skills_required || []).join(", ")}
- Tags: ${(job?.tags || []).join(", ")}

Write a compelling, authentic 3-paragraph cover letter (no salutation/sign-off needed, just body):
1. Paragraph 1: Why THIS company specifically (reference their actual product/mission)
2. Paragraph 2: Most relevant skills/projects that directly match this role
3. Paragraph 3: Specific value you'd bring + genuine enthusiasm

Rules:
- Sound human, not corporate
- Reference specific technologies from their stack
- Max 250 words total
- No clichés ("I am writing to express my interest...")
- Return ONLY the cover letter text, no extra formatting`;

  try {
    const result = await generateOrbitResponse(prompt, false);
    const text = typeof result === "string" ? result : JSON.stringify(result);
    return NextResponse.json({ coverLetter: text || "Unable to generate cover letter. Please try again." });
  } catch {
    return NextResponse.json({ coverLetter: "Unable to generate cover letter. Please try again." });
  }
}
