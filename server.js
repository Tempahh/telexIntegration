const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

let messageCount = 0;

// Middleware to parse JSON
app.use(express.json());

// POST endpoint for /sendnotification
app.post("/sendnotification", async (req, res) => {
  const { channel_id, settings, message } = req.body;

  if (!channel_id || !settings || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Extract settings
  const threshold = settings.find(s => s.label === "notificationThreshold")?.default || 5;
  const slackWebhookUrl = settings.find(s => s.label === "slackWebhookUrl")?.default;
  const triggerWord = settings.find(s => s.label === "triggerWord")?.default || "urgent";

  // Check if the message contains the trigger word
  if (message.toLowerCase().includes(triggerWord.toLowerCase())) {
    messageCount++;
    console.log(`Trigger word found. Message count: ${messageCount}`);
  }

  // If count reaches threshold, send a Slack notification
  if (messageCount >= threshold) {
    try {
      await axios.post(slackWebhookUrl, {
        text: `🚨 Threshold reached! you have ${threshold} ${triggerWord} alerts.`,
      });
      console.log("Slack notification sent!");
      messageCount = 0; // Reset counter after notification
    } catch (error) {
      console.error("Failed to send Slack notification:", error);
    }
  }

  res.json({
    event_name: "notification_sent",
    message_count: messageCount,
    status: "success",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
