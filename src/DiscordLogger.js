const { TextChannel } = require("discord.js");
const { actionLogEnabled, actionLogChannel, moderationLogEnabled, moderationLogChannel } = require("../config/config.json");
const Action = actionLogChannel; // Default action log channel ID
const Moderation = moderationLogChannel; // Default moderation log channel ID

async function Log(logChannel, embed) {
    if (logChannel == Action && !actionLogEnabled) return;
    if (logChannel == Moderation && !moderationLogEnabled) return;

    await logChannel.send({ embeds: [embed] });
}

module.exports = {
    Action,
    Moderation,
    Log,
}