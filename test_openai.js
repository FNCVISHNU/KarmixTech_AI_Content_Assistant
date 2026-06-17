import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
console.log("Using API Key:", apiKey ? apiKey.substring(0, 12) + "..." : "None");

if (!apiKey) {
  console.error("No API key found!");
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

try {
  console.log("Sending test request to OpenAI...");
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "Say hello!" }],
    max_tokens: 10
  });
  console.log("Success! Response:", response.choices[0].message.content);
} catch (error) {
  console.error("Failed to call OpenAI API!");
  console.error("Error Message:", error.message);
  console.error("Full Error Object:", error);
}
