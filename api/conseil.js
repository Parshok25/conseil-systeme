const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { system, messages } = req.body;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system,
      messages,
    });

    res.status(200).json({ content: response.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
