const Logger = require("../Logger");
const DiscordLogger = require("../DiscordLogger");
const { EmbedBuilder } = require("@discordjs/builders");
const { TextChannel, VoiceChannel } = require("discord.js");

module.exports = {
    name: 'channelUpdate',
    async execute(oldChannel, newChannel, client)
    {
        const logEmbed = new EmbedBuilder()
        .setTitle("Channel was updated")
        .setTimestamp();

        // General updates
        if (oldChannel.name != newChannel.name) {
            logEmbed.addFields([
                { name: "Old name", value: `\`${oldChannel.name}\``, inline: true },
                { name: "New name", value: `\`${newChannel.name}\``, inline: true }
            ]);
        }
        if (oldChannel.parent.name != newChannel.parent.name) {
            logEmbed.addFields([
                { name: "Old category", value: `\`${oldChannel.parent.name}\``, inline: true },
                { name: "New category", value: `\`${newChannel.parent.name}\``, inline: true }
            ])
        }
        if (oldChannel.permissionOverwrites != newChannel.permissionOverwrites) {
            logEmbed.addFields([
                { name: "Permissions", value: `\`Permissions have been updated\``, inline: true }
            ])
        }

        // Text channel updates
        if (typeof(newChannel) == TextChannel) {
            if (oldChannel.nsfw != newChannel.nsfw) {
                logEmbed.addFields([
                    { name: "Old NSFW status", value: `\`${oldChannel.nsfw}\``, inline: true },
                    { name: "New NSFW status", value: `\`${newChannel.nsfw}\``, inline: true }
                ])
            }
            if (oldChannel.rateLimitPerUser != newChannel.rateLimitPerUser) {
                logEmbed.addFields([
                    { name: "Old slowmode time", value: `\`${oldChannel.rateLimitPerUser} seconds\``, inline: true },
                    { name: "New slowmode time", value: `\`${newChannel.rateLimitPerUser} seconds\``, inline: true }
                ])
            }
        }

        // Voice channel updates
        if (typeof(newChannel) == VoiceChannel) {
            if (oldChannel.bitrate != newChannel.bitrate) {
                logEmbed.addFields([
                    { name: "Old bitrate", value: oldChannel.bitrate, inline: true },
                    { name: "New bitrate", value: newChannel.bitrate, inline: true }
                ])
            }
            if (oldChannel.userLimit != newChannel.userLimit) {
                logEmbed.addFields([
                    { name: "Old user limit", value: oldChannel.userLimit, inline: true },
                    { name: "New user limit", value: newChannel.userLimit, inline: true }
                ])
            }
            if (oldChannel.bitrate != newChannel.bitrate) {
                logEmbed.addFields([
                    { name: "Old bitrate", value: oldChannel.bitrate, inline: true },
                    { name: "New bitrate", value: newChannel.bitrate, inline: true }
                ])
            }
        }

        // Send the log embed
        const channel = newChannel.guild.channels.cache.find(c => c.id == DiscordLogger.Default);
        await DiscordLogger.Log(channel, logEmbed);
    }
}