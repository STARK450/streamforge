import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a Java transformation snippet based on natural language description.
 */
export const generateTransformationCode = async (description: string): Promise<string> => {
  try {
    const prompt = `
      You are an expert Java developer for a distributed data processing system. 
      Generate a concise Java method snippet (no class definition needed, just the logic) 
      that implements the DataTransformer interface to process a JSON payload.
      
      The user wants to: ${description}
      
      The signature is: 
      public JsonObject transform(JsonObject input) { ... }
      
      Return ONLY the code block.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text?.replace(/```java/g, '').replace(/```/g, '').trim() || '// No code generated';
  } catch (error) {
    console.error("Gemini API Error:", error);
    return '// Error generating code. Please check API Key or try again.';
  }
};

/**
 * Analyzes a simulated error log to provide a root cause analysis.
 */
export const analyzeErrorLog = async (jobName: string, errorSnippet: string): Promise<string> => {
  try {
    const prompt = `
      Analyze the following error log from a distributed data pipeline job named "${jobName}".
      Provide a concise root cause and a recommended fix.
      
      Error Log:
      ${errorSnippet}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || 'Unable to analyze error.';
  } catch (error) {
    console.error("Gemini API Error:", error);
    return 'Analysis unavailable due to API error.';
  }
};