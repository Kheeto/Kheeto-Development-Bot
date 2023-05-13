const Logger = require("../Logger");
const DiscordLogger = require("../DiscordLogger");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    name: 'channelUpdate',
    async execute(oldChannel, newChannel, client)
    {
        const logEmbed = new EmbedBuilder()
        .setTitle("A channel has been updated")
        .setTimestamp();

        // Channel type
        if (newChannel.isText()) {
            logEmbed.addFields([
                { name: "Type", value: `\`Text channel\``, inline: true }
            ]);
            await DiscordLogger.Log(DiscordLogger.Default, logEmbed);
        }
        else if (newChannel.isVoice()) {
            logEmbed.addFields([
                { name: "Type", value: `\`Voice channel\``, inline: true }
            ]);
            await DiscordLogger.Log(DiscordLogger.Default, logEmbed);
        }

        // General updates
        if (oldChannel.name != newChannel.name) {
            logEmbed.addFields([
                { name: "Old name", value: oldChannel.name, inline: false },
                { name: "New name", value: newChannel.name, inline: true }
            ]);
        }
        if (oldChannel.parent.name != newChannel.parent.name) {
            logEmbed.addFields([
                { name: "Old category", value: oldChannel.parent.name, inline: false },
                { name: "New category", value: newChannel.parent.name, inline: true }
            ])
        }
        if (oldChannel.permissionOverwrites != newChannel.permissionOverwrites) {
            logEmbed.addFields([
                { name: "Permissions", value: "Permissions have been updated", inline: false }
            ])
        }

        // Text channel updates
        if (newChannel.isText()) {
            if (oldChannel.nsfw != newChannel.nsfw) {
                logEmbed.addFields([
                    { name: "Old NSFW status", value: oldChannel.nsfw, inline: false },
                    { name: "New NSFW status", value: newChannel.nsfw, inline: true }
                ])
            }
            if (oldChannel.rateLimitPerUser != newChannel.rateLimitPerUser) {
                logEmbed.addFields([
                    { name: "Old slowmode time", value: `${oldChannel.rateLimitPerUser} seconds`, inline: false },
                    { name: "New slowmode time", value: `${newChannel.rateLimitPerUser} seconds`, inline: true }
                ])
            }
        }

        // Voice channel updates
        if (newChannel.isVoice()) {
            if (oldChannel.bitrate != newChannel.bitrate) {
                logEmbed.addFields([
                    { name: "Old bitrate", value: oldChannel.bitrate, inline: false },
                    { name: "New bitrate", value: newChannel.bitrate, inline: true }
                ])
            }
            if (oldChannel.userLimit != newChannel.userLimit) {
                logEmbed.addFields([
                    { name: "Old user limit", value: oldChannel.userLimit, inline: false },
                    { name: "New user limit", value: newChannel.userLimit, inline: true }
                ])
            }
            if (oldChannel.bitrate != newChannel.bitrate) {
                logEmbed.addFields([
                    { name: "Old bitrate", value: oldChannel.bitrate, inline: false },
                    { name: "New bitrate", value: newChannel.bitrate, inline: true }
                ])
            }
        }
    }
}