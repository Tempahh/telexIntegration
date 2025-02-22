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

app.get("/integration-config", (req, res) => {
    res.json({
      data: {
        date: {
          created_at: "2025-02-22",
          updated_at: "2025-02-22"
        },
        descriptions: {
          app_name: "Persistent Error Notifier",
          app_description: "Implements a message counting integration that listens for incoming messages and sends Slack alerts when a certain threshold is reached.",
          app_logo: "https://www.canva.com/design/DAGf0KBIoZI/YkY2nGHQ5WLkDyvBqIFCgQ/view?utm_content=DAGf0KBIoZI&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h0d50c039e5",
          app_url: "https://telexintegration.onrender.com",
          background_color: "#fff"
        },
        is_active: true,
        integration_type: "modifier",
        integration_category: "Monitoring & Logging",
        key_features: [
          "Listens for incoming messages.",
          "Sends Slack alerts when a certain threshold is reached."
        ],
        author: "Tempah",
        settings: [
          {
            label: "notificationThreshold",
            type: "number",
            required: true,
            default: "5"
          },
          {
            label: "slackWebhookUrl",
            type: "text",
            required: true,
            default: "https://hooks.slack.com/services/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"
          },
          {
            label: "triggerWord",
            type: "multi-select",
            required: true,
            default: "urgent, critical, fatal"
          }
        ],
        target_url: "https://telexintegration.onrender.com/sendnotification",
        tick_url: "https://telexintegration.onrender.com/sendnotification",
      }
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
