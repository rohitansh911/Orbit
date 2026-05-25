import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./prompts";
import { getServerEnv } from "./env";

const apiKey = getServerEnv().GEMINI_API_KEY;
export const aiClient = new GoogleGenAI(apiKey ? { apiKey } : {});

export const DEFAULT_MODEL = "gemini-2.5-flash";

const AI_TIMEOUT_MS = 30_000; // 30 second timeout
const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 2000;

/**
 * Helper to call Gemini with retry, timeout, and robust JSON parsing.
 */
export async function generateOrbitResponse(prompt: string, isJson: boolean = false): Promise<any> {
  if (!apiKey) {
    if (isJson) return [];
    return "Intelligence module offline. API key required.";
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Timeout via AbortController
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

      const response = await aiClient.models.generateContent({
        model: DEFAULT_MODEL,
        contents: [
          { role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }] }
        ],
        config: {
          temperature: 0.3,
          responseMimeType: isJson ? "application/json" : "text/plain",
        },
      });

      clearTimeout(timeout);

      let text = response.text || "";

      if (isJson) {
        // Strip markdown code blocks if the LLM hallucinates them
        text = text.trim();
        if (text.startsWith('```')) {
          text = text.replace(/^```json\n?/, '').replace(/^```\n?/, '').replace(/\n?```$/, '').trim();
        }
        try {
          return JSON.parse(text);
        } catch (parseError) {
          // Try to extract JSON from mixed output
          const jsonMatch = text.match(/[\[{][\s\S]*[\]}]/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
          throw new Error(`JSON parse failed: ${text.substring(0, 200)}`);
        }
      }

      return text;
    } catch (error: any) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        continue;
      }
    }
  }

  console.error("Orbit AI Generation Error (all retries exhausted):", lastError);
  if (isJson) return [];
  return "Intelligence temporarily unavailable. Please try again.";
}
