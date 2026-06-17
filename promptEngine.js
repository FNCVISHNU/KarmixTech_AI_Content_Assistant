/**
 * Builds a structured prompt for OpenAI based on user inputs.
 * Incorporates Tone Presets, Multilingual support, and AI Humanization.
 * @param {Object} data The content generation request parameters.
 * @returns {string} The final compiled prompt string.
 */
export function buildPrompt(data) {
  const contentType = data.content_type || "Blog Post";
  const topic = data.topic || "";
  const audience = data.audience || "";
  const tone = data.tone || "Professional";
  const platform = data.platform || "";
  const goal = data.goal || "";
  const keywords = data.keywords || "";
  const wordCount = data.word_count || 300;
  const language = data.language || "English";
  const humanize = data.humanize || false;

  // Tone presets mapping
  const toneGuidelines = {
    "Professional": "Clear, authoritative, objective, and respectful. Focus on value, data, and expertise. Avoid excessive slang or casual colloquialisms.",
    "Luxury": "Sophisticated, exclusive, refined, and elegant. Use evocative and sensory language. Emphasize craftsmanship, heritage, prestige, and high status.",
    "Gen-Z": "Casual, relatable, highly conversational, and modern. Incorporate light humor, relevant internet culture style (but not overly forced), and punchy phrasing. Speak like a peer.",
    "Emotional": "Empathetic, moving, story-driven, and highly resonant. Connect deeply with the reader's feelings, pains, hopes, or nostalgic moments.",
    "Corporate": "Polished, B2B-oriented, strategic, and professional. Focus on efficiency, ROI, scale, metrics, and business-focused success."
  };

  const selectedToneGuideline = toneGuidelines[tone] || `Write in a ${tone} tone.`;

  // Humanizer rules
  let humanizerInstructions = "";
  if (humanize) {
    humanizerInstructions = `
HUMANIZER RULES (CRITICAL):
- Avoid all robotic AI cliches: do NOT use words like "delve", "tapestry", "furthermore", "testament", "revolutionize", "in conclusion", "it is crucial to", "moreover", "in today's fast-paced digital world", "beacon", "nested".
- Write with varied sentence lengths (burstiness). Combine short, punchy sentences with longer, fluid ones.
- Keep the voice warm, conversational, and direct. Speak as if talking to a trusted friend.
- Use the active voice. Focus on real, relatable scenarios rather than abstract generalizations.
- Ensure the text sounds completely natural, smooth, and authentic.
`;
  }

  const prompt = `
You are an expert AI Content Strategist and Professional Copywriter.

TASK:
Generate high-quality ${contentType}.

TOPIC:
${topic}

TARGET AUDIENCE:
${audience}

TONE STYLE:
Tone: ${tone}
Guidelines: ${selectedToneGuideline}

PLATFORM OPTIMIZATION:
${platform}

GOAL OF THIS CONTENT:
${goal}

SEO KEYWORDS (INCORPORATE NATURALLY):
${keywords}

TARGET WORD COUNT:
Approx. ${wordCount} words

OUTPUT LANGUAGE:
Generate the response entirely in: ${language}

INSTRUCTIONS:
1. Make the content highly engaging.
2. Use a strong hook at the very beginning to grab attention.
3. Keep readability high (use short paragraphs, bullet points if appropriate).
4. Use persuasive, audience-aligned language.
5. Add a compelling Call to Action (CTA) at the end.
6. Avoid robotic language or rigid structural clichés.
7. Ensure grammar is flawless.
${humanizerInstructions}

OUTPUT FORMAT:
Provide the output in a clean, structured JSON format with EXACTLY the following keys. Do NOT wrap the JSON in markdown code blocks:
{
  "Title": "Generate an attention-grabbing title or headline appropriate for the platform and content type",
  "MainContent": "Generate the full main body content, formatted with line breaks (\\n) and paragraphs as needed",
  "CTA": "Generate a clear, persuasive Call to Action (CTA) optimized for the goal"
}
`;

  return prompt;
}
