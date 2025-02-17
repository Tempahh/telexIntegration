export function validateTelexPayload(payload) {
    return payload && typeof payload.message === "string" &&
           typeof payload.channel_id === "string" &&
           Array.isArray(payload.settings);
}
