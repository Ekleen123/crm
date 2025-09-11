const express = require("express");
const router = express.Router();
const CommunicationLog = require("../models/CommunicationLog");

// 1. Fake Send API (simulate vendor sending)
router.post("/send", async (req, res) => {
  try {
    const { logId, message } = req.body;

    // validate request
    if (!logId || !message) {
      return res.status(400).json({ error: "logId and message are required" });
    }

    // simulate 90% success
    const success = Math.random() < 0.9;
    const status = success ? "SENT" : "FAILED";

    // simulate vendor delay and call back to /receipt
    setTimeout(async () => {
      try {
        await fetch("http://localhost:5000/api/vendor/receipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ logId, status, vendorResponse: "MockVendorResponse" }),
        });
      } catch (err) {
        console.error("Error calling receipt API:", err.message);
      }
    }, 1000);

    res.json({ message: "Vendor accepted message", status: "PROCESSING" });
  } catch (error) {
    console.error("Error in /send:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 2. Delivery Receipt API (vendor confirms result)
router.post("/receipt", async (req, res) => {
  try {
    const { logId, status, vendorResponse } = req.body;

    // validation
    if (!logId || !status) {
      return res.status(400).json({ error: "logId and status are required" });
    }

    const updatedLog = await CommunicationLog.findByIdAndUpdate(
      logId,
      { status, vendorResponse },
      { new: true } // return updated document
    );

    if (!updatedLog) {
      return res.status(404).json({ error: "CommunicationLog not found" });
    }

    res.json({ message: "Receipt processed", log: updatedLog });
  } catch (error) {
    console.error("Error in /receipt:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
