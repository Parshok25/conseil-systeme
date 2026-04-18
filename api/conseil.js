module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      res.status(500).json({ error: "Clé API manquante" });
      return;
    }

    const { system, messages } = req.body;

    if (!system || !messages) {
      res.status(500).json({ error: "Paramètres manquants", body: req.body });
      return;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system,
        messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(500).json({ 
        error: "Erreur Anthropic", 
        status: response.status,
        details: data 
      });
      return;
    }

    res.status(200).json({ content: data.content });

  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
};
