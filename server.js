const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

let messageCount = 0;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
    res.send("Welcome to the Persistent Error Notifier API!");
});

app.post('/sendnotification', async (req, res) => {
    console.log('Received request:', req.body);
  const { channel_id, settings, message } = req.body;
  console.log('channel_id:', channel_id);
  const threshold = settings.find(s => s.label === 'notificationThreshold').default;
  const slackWebhookUrl = settings.find(s => s.label === 'slackWebhookUrl').default;
  const triggerWords = settings.find(s => s.label === 'triggerWord').default.split(',').map(word => word.trim().toLowerCase());

  const messageContent = message.toLowerCase();
  const containsTriggerWord = triggerWords.some(word => messageContent.includes(word));
  console.log('containsTriggerWord:', containsTriggerWord);

  if (containsTriggerWord) {
    messageCount++;
    console.log('messageCount:', messageCount);

    if (messageCount >= threshold) {
      try {
        await axios.post(slackWebhookUrl, {
          text: `Threshold reached! ${messageCount} trigger messages detected in channel ${channel_id}.`},
        {timeout: 3000}
        );
        messageCount = 0; // Reset the count after sending notification
      } catch (error) {
        console.error('Failed to send Slack notification:', error);
      }
    }
  }

  res.json({
    event_name: "message_count_updated",
    message: `${messageCount} trigger messages detected in channel ${channel_id}.`,
    status: "success",
    username: "persistent-error-notifier"
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
            default: process.env.SLACK_WEBHOOK_URL
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
