import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

import { buildPrompt } from './promptEngine.js';
import { validateInput } from './validators.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const apiKey = process.env.OPENAI_API_KEY || "";
let openai = null;
if (apiKey && !apiKey.startsWith("your_openai_api_key")) {
  openai = new OpenAI({ apiKey });
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: "online",
    message: "AI Content Generation Assistant API Running",
    api_key_configured: !!openai
  });
});

// Main generate endpoint
app.post('/generate', async (req, res) => {
  const data = req.body;

  // Validate inputs
  const missingFields = validateInput(data);
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  const prompt = buildPrompt(data);

  // If OpenAI is not configured, fall back to simulated response for testing/demo
  if (!openai) {
    const simulatedTitle = `Empowering Your Future: A Guide to ${data.topic.toUpperCase()}`;
    const simulatedContent = `Are you ready to take your next big step? In this comprehensive look at ${data.topic}, we explore how it directly addresses the needs of ${data.audience}.\n\nBy aligning with your goal to '${data.goal}', we've crafted this ${data.content_type} to resonate deeply and offer immediate, actionable value. Highly optimized for ${data.platform}, it maintains a perfect ${data.tone} tone and seamlessly incorporates keywords like '${data.keywords}' for maximum visibility.`;
    const simulatedCTA = `Ready to learn more? Let's connect and achieve your goal to ${data.goal} together!`;

    return res.json({
      generated_content: {
        Title: simulatedTitle,
        MainContent: simulatedContent,
        CTA: simulatedCTA
      },
      note: "Running in DEMO/SIMULATION mode. Add a valid OPENAI_API_KEY in the backend/.env file to run live GPT-4o-mini generation."
    });
  }

  try {
    // Request completion from OpenAI with JSON response format
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a professional AI content generator. You must respond with valid JSON containing the keys: 'Title', 'MainContent', and 'CTA'."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8
    });

    const rawOutput = response.choices[0].message.content;
    const parsedJson = JSON.parse(rawOutput);

    res.json({
      generated_content: parsedJson
    });

  } catch (error) {
    // Graceful error fallback for quota issues, invalid keys, etc.
    const errorMsg = error.message || "Unknown error";
    console.error("OpenAI API Error:", error);

    const simulatedTitle = `[Demo Output] Master ${data.topic.toUpperCase()} Today`;
    const simulatedContent = `Welcome to the ultimate guide on ${data.topic}! Specifically designed for ${data.audience}, this copy has been tailored to help you ${data.goal}. Whether you are just starting out or looking to optimize your workflow, these principles will serve you well.\n\nWritten in a refined ${data.tone} tone, this ${data.content_type} is ready for deployment on ${data.platform}. Don't let common roadblocks slow you down.`;
    const simulatedCTA = `Click here to ${data.goal} and start your journey now!`;

    res.json({
      generated_content: {
        Title: simulatedTitle,
        MainContent: simulatedContent,
        CTA: simulatedCTA
      },
      error_detail: errorMsg,
      note: "OpenAI API returned an error. Showing premium mock content for testing. Check the backend logs for detailed error trace."
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
