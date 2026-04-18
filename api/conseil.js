const https = require("https");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const { system, messages } = req.body;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    const payload = JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system,
      messages
    });

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: "api.anthropic.com",
        path: "/v1/messages",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Length": Buffer.byteLength(payload)
        }
      };

      const request = https.request(options, (response) => {
        let data = "";
        response.on("data", chunk => data += chunk);
        response.on("end", () => resolve({ status: response.statusCode, body: data }));
      });

      request.on("error", reject);
      request.write(payload);
      request.end();
    });

    const data = JSON.parse(result.body);

    if (result.status !== 200) {
      res.status(500).json({ error: "Erreur Anthropic", details: data });
      return;
    }

    res.status(200).json({ content: data.content });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
