import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import mammoth from "mammoth";
// import { createRequire } from "module";

// const require = createRequire(import.meta.url);
// const pdfData = await pdfParse(dataBuffer);
// const pdfParse = require("pdf-parse").default;


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* =========================
   SKILL EXTRACTION
========================= */
app.post("/extract-skills", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ skills: [] });
    }

    const result = await mammoth.extractRawText({
      path: req.file.path,
    });

    const text = result.value.toLowerCase();

    const SKILLS = [
      "react",
      "javascript",
      "node",
      "express",
      "mongodb",
      "sql",
      "python",
      "java",
      "html",
      "css",
      "typescript",
      "redux",
      "next",
    ];

    const detectedSkills = SKILLS.filter(skill =>
      text.includes(skill)
    );

    res.json({ skills: [...new Set(detectedSkills)] });

  } catch (err) {
    console.error("DOCX ERROR:", err);
    res.json({ skills: [] });
  }
});






/* =========================
   START INTERVIEW
========================= */
app.post("/start-interview", async (req, res) => {
  try {
    const skills = Array.isArray(req.body.skills) ? req.body.skills : [];
    const jd = req.body.jd || "";

    if (!skills.length || !jd.trim()) {
      return res.json({ questions: [] });
    }

    const QUESTION_BANK = {
      react: [
        "How does React decide when to re-render a component?",
        "Explain a real-world use case of useEffect cleanup.",
        "Why are keys important in React lists?",
        "How would you optimize a slow React application?",
        "Difference between controlled and uncontrolled components?",
      ],
      javascript: [
        "Explain closures with a real-world example.",
        "Difference between == and === and why it matters.",
        "How does async/await work internally?",
        "What is event delegation and where is it useful?",
      ],
      node: [
        "How does Node.js handle concurrent requests?",
        "Explain the event loop with a real example.",
        "What causes memory leaks in Node.js?",
        "How would you design a rate limiter?",
      ],
      express: [
        "What is middleware in Express and how does it work?",
        "Difference between app.use and app.get?",
        "How do you handle errors globally in Express?",
      ],
      mongodb: [
        "Difference between embedded and referenced documents?",
        "How does indexing improve MongoDB performance?",
      ],
    };

    const questions = [];

    skills.forEach(skill => {
      const bank = QUESTION_BANK[skill];
      if (bank && bank.length) {
        const randomQ = bank[Math.floor(Math.random() * bank.length)];
        questions.push({
          skill,
          question: randomQ,
        });
      }
    });

    return res.json({ questions });

  } catch (err) {
    console.error("Interview error:", err.message);
    return res.json({ questions: [] });
  }
});




/* =========================
   EVALUATE ANSWER
========================= */
app.post("/evaluate-answer", async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!answer || answer.trim().length < 20) {
      return res.json({
        score: 2,
        feedback: "Answer too short. Please explain with more detail.",
      });
    }

    // 🧠 STEP 1: LOGIC-BASED SCORE (ALWAYS WORKS)
    let score = 3;

    const a = answer.toLowerCase();

    if (a.length > 150) score += 2;
    if (a.includes("state")) score += 1;
    if (a.includes("effect")) score += 1;
    if (a.includes("context")) score += 1;
    if (a.includes("lifecycle")) score += 1;
    if (a.includes("re-render")) score += 1;

    score = Math.min(score, 9);

    // 🧠 STEP 2: TRY GEMINI FOR FEEDBACK ONLY
    let feedback = "Answer evaluated based on structure and concepts.";

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.0-pro",
      });

      const prompt = `
Give one-line feedback for this interview answer.

Question:
${question}

Answer:
${answer}
`;

      const result = await model.generateContent(prompt);
      feedback = result.response.text().trim();
    } catch (aiErr) {
      feedback += " (AI feedback unavailable)";
    }

    return res.json({ score, feedback });

  } catch (err) {
    console.error("Fatal evaluation error:", err.message);
    return res.json({
      score: 3,
      feedback: "Evaluation completed with fallback logic.",
    });
  }
});




/* =========================
   SERVER
========================= */
app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
