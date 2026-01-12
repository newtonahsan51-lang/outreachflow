
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly as required by guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GenerationParams {
  product: string;
  icp: string;
  painPoint: string;
  offer: string;
  tone: 'Formal' | 'Friendly' | 'Aggressive';
}

export const generateEmailCopy = async (params: GenerationParams) => {
  const ai = getAI();
  const prompt = `Write a professional cold email for a SaaS product.
  Product: ${params.product}
  Target Audience (ICP): ${params.icp}
  Pain Point: ${params.painPoint}
  Offer: ${params.offer}
  Tone: ${params.tone}
  
  Provide a subject line and the email body.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING }
          },
          required: ["subject", "body"]
        }
      }
    });

    // Access .text property directly, do not call as a function
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
