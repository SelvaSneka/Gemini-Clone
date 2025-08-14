import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { response } from "express";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Basic check for API key presence
if (!GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is not defined in your environment variables (.env file).");
  console.error("Please add VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE to your .env file.");
}

const ai = new GoogleGenerativeAI({ apiKey: GEMINI_API_KEY });


export async function generateContentFromGemini(userPrompt) {
  if (!GEMINI_API_KEY) {
    return "Error: API Key is missing. Cannot generate content.";
  }

  try {
    const model = ai.getGenerativeModel({
      model: 'gemini-pro',
    });

    
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];


    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userPrompt }] }], // Format the prompt for generateContent
        generationConfig,
        safetySettings,
    });

    const response = await result.response;
    return response.text(); // Return the text
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    
    throw new Error("Failed to get response from Gemini API: " + error.message);
    return response.text();
  }
}