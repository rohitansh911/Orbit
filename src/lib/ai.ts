import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./prompts";

// Standardize fallback if API key is missing. This prevents build/runtime crashes.
const apiKey = process.env.GEMINI_API_KEY || "";
export const aiClient = new GoogleGenAI(apiKey ? { apiKey } : {});

export const DEFAULT_MODEL = "gemini-2.5-flash";

/**
 * Helper to call Gemini and ensure the system prompt is applied.
 * Uses a lightweight flash model by default for speed.
 */
export async function generateOrbitResponse(prompt: string, isJson: boolean = false): Promise<any> {
  if (!apiKey) {
    // Graceful fallback for local dev without keys
    if (isJson) return [];
    return "Intelligence module offline. API key required.";
  }

  try {
    const response = await aiClient.models.generateContent({
      model: DEFAULT_MODEL,
      contents: [
        { role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }] }
      ],
      config: {
        temperature: 0.3, // Keep responses grounded and strategic
        responseMimeType: isJson ? "application/json" : "text/plain",
      }
    });

    let text = response.text || "";
    
    if (isJson) {
      // Strip markdown code blocks if the LLM hallucinates them
      if (text.trim().startsWith('```')) {
        text = text.replace(/^```json\n?/, '').replace(/^```\n?/, '').replace(/\n?```$/, '').trim();
      }
      return JSON.parse(text);
    }

    return text;
  } catch (error) {
    console.error("Orbit AI Generation Error:", error);
    throw new Error("Failed to generate intelligence.");
  }
}
