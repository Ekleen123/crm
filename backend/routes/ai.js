const express = require("express");
const router = express.Router();
const axios = require("axios");

// POST /ai/suggest-messages
router.post("/suggest-messages", async (req, res) => {
  try {
    const { objective } = req.body;

    if (!objective) {
      return res.status(400).json({ error: "Campaign objective is required" });
    }

    // Call OpenAI (or mock for demo)
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an assistant generating short marketing messages.",
          },
          {
            role: "user",
            content: `Generate 3 short promotional messages for this campaign objective: "${objective}".`,
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

    const suggestions =
      response.data.choices[0].message.content.split("\n").filter(Boolean);

    res.json({ suggestions });
  } catch (error) {
    console.error("AI API error:", error.message);

    // fallback mock if OpenAI fails
    res.json({
      suggestions: [
        `Special offer just for you! (${req.body.objective})`,
        `Don’t miss out – exclusive deal on ${req.body.objective}`,
        `Your next ${req.body.objective} is waiting with 10% off!`,
      ],
    });
  }
});

module.exports = router;

