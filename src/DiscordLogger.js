const { actionLogEnabled, actionLogChannel } = require("../config/config.json");
const Default = actionLogChannel; // Default action log channel ID

async function Log(logChannel, embed) {
    if (!actionLogEnabled) return;
    await logChannel.send({ embeds: [embed] });
}

module.exports = {
    Default,
    Log,
}