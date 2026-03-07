import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey ?? "" });

export type JsonSchema = {
  type: "object" | "string" | "number" | "boolean" | "array";
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  description?: string;
  enum?: unknown[];
};

/**
 * Generate a JSON response from Gemini using structured output.
 * @param prompt - The prompt to send to the model
 * @param schema - JSON Schema defining the expected response structure
 * @param options - Optional config (model, temperature)
 * @returns Parsed JSON object conforming to the schema
 */
export async function generateJSON<T = unknown>(
  prompt: string,
  schema: JsonSchema,
  options?: {
    model?: string;
    temperature?: number;
  }
): Promise<T> {
  const model = options?.model ?? "gemini-2.5-flash";
  const temperature = options?.temperature ?? 0.2;

  const response = await ai.models.generateContent({
    model,
    contents: prompt, 
    config: {
      temperature,
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response text from Gemini");
  }

  return JSON.parse(text) as T;
}
