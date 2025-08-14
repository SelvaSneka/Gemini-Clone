import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// ✅ Explicitly specify the path to your .env file
dotenv.config({ path: "./src/server/.env" });

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

app.post('/ask-gemini', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent([prompt]);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
