# Persistent Error Notifier API

A Node.js-powered API that listens for incoming messages and sends Slack alerts when specific trigger words hit a defined threshold. Ideal for monitoring error logs or keeping an eye on critical updates—because who doesn’t love proactive error hunting?

## 🚀 Features

- Listens for incoming messages.
- Detects trigger words (like "urgent," "critical," or "fatal").
- Sends Slack notifications when the message threshold is hit.
- Fully customizable thresholds and trigger words.

## 🔧 Technologies Used

- **Node.js**
- **Express.js**
- **Axios**
- **CORS** for cross-origin requests
- **dotenv** for environment variable management

## 📦 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/persistent-error-notifier.git
   cd persistent-error-notifier
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file and add your Slack webhook URL:

   ```env
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url
   ```

4. **Run the application:**

   ```bash
   npm start
   ```

## 📍 API Endpoints

### `GET /`

Returns a welcome message.

**Response:**

```json
{
  "message": "Welcome to the Persistent Error Notifier API!"
}
```

### `POST /sendnotification`

Sends a Slack notification when the message threshold is reached.

**Request Body:**

```json
{
  "settings": [
    { "label": "notificationThreshold", "default": "5" },
    { "label": "slackWebhookUrl", "default": "https://hooks.slack.com/services/your/webhook/url" },
    { "label": "triggerWord", "default": "urgent, critical, fatal" }
  ],
  "message": "This is a critical error!"
}
```

**Sample cURL Request:**

```bash
curl -X POST https://telexintegration.onrender.com/sendnotification \
  -H "Content-Type: application/json" \
  -d '{
    "channel_id": "abc123",
    "settings": [
      { "label": "notificationThreshold", "default": 5 },
      { "label": "slackWebhookUrl", "default": "https://hooks.slack.com/services/your/slack/webhook" },
      { "label": "triggerWord", "default": "urgent" }
    ],
    "message": "This is an urgent message for testing."
  }'
```

**Response:**

```json
{
  "event_name": "message_count_updated",
  "message": "5 trigger messages detected in channel.",
  "status": "success",
  "username": "persistent-error-notifier"
}
```

### `GET /integration-config`

Returns integration configuration details.

**Response:**

```json
{
  "data": {
    "app_name": "Persistent Error Notifier",
    "app_description": "Implements a message counting integration that sends Slack alerts when a certain threshold is reached.",
    "author": "Tempah",
    "integration_type": "modifier",
    "integration_category": "Monitoring & Logging"
  }
}
```

## ⚙️ Customization

You can tweak these settings:

- `notificationThreshold`: Number of trigger messages before sending a notification (default: 5).
- `slackWebhookUrl`: Your Slack webhook URL.
- `triggerWord`: Comma-separated list of words that should trigger alerts (e.g., "urgent, critical, fatal").

## 🏗️ Deployment

The app is live on Render:

🌐 **[Persistent Error Notifier API](https://telexintegration.onrender.com)**

## 👨🏽‍💻 Author

**Tempah**

## 📄 License

This project is licensed under the MIT License.

---

*"Because missing critical errors? That's so last season."*

