const express = require("express");
const router = express.Router();
const axios = require("axios");

// POST /ai/summarize
router.post("/summarize", async (req, res) => {
  try {
    const { name, sent, failed, audienceSize } = req.body;

    if (audienceSize == null || sent == null || failed == null) {
      return res.status(400).json({ error: "Missing campaign stats" });
    }

    // Call OpenAI (or mock for demo)
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an assistant summarizing marketing campaign performance.",
          },
          {
            role: "user",
            content: `Summarize this campaign: "${name}". Stats: Audience size: ${audienceSize}, Sent: ${sent}, Failed: ${failed}. Provide a short business insight.`,
          },
        ],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summary = response.data.choices[0].message.content.trim();
    res.json({ summary });
  } catch (error) {
    console.error("AI summary error:", error.message);

    // fallback mock
    res.json({
      summary: `Campaign "${req.body.name}" reached ${req.body.audienceSize} users. ${req.body.sent} delivered, ${req.body.failed} failed. Most messages reached successfully.`,
    });
  }
});

module.exports = router;
