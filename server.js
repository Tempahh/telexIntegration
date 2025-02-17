const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.post("/format-message", (req, res) => {
    const { channel_id, settings, message } = req.body;
    if (!channel_id || !settings || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    let maxMessageLength = 500;
    let repeatWords = [];
    let noOfRepetitions = 1;

    settings.forEach(setting => {
        if (setting.label === "maxMessageLength") maxMessageLength = setting.default;
        if (setting.label === "repeatWords") repeatWords = setting.default.split(", ");
        if (setting.label === "noOfRepetitions") noOfRepetitions = setting.default;
    });

    let formattedMessage = message;
    repeatWords.forEach(word => {
        formattedMessage = formattedMessage.replace(new RegExp(`\\b${word}\\b`, "g"), word.repeat(noOfRepetitions));
    });

    if (formattedMessage.length > maxMessageLength) {
        formattedMessage = formattedMessage.substring(0, maxMessageLength);
    }

    res.json({
        event_name: "message_formatted",
        message: formattedMessage,
        status: "success",
        username: "message-formatter-bot"
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));