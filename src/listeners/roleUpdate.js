const Logger = require("../Logger");
const DiscordLogger = require("../DiscordLogger");
const { EmbedBuilder } = require("@discordjs/builders");
const { TextChannel, VoiceChannel } = require("discord.js");

module.exports = {
    name: 'roleUpdate',
    async execute(oldRole, newRole, client)
    {
        const logEmbed = new EmbedBuilder()
        .setTitle("Role was updated")
        .setTimestamp();

        // General updates
        if (oldRole.name != newRole.name) {
            logEmbed.addFields([
                { name: "Old name", value: `\`${oldChannel.name}\``, inline: true },
                { name: "New name", value: `\`${newChannel.name}\``, inline: true }
            ]);
        }
        if (oldRole.hexColor != newRole.hexColor) {
            logEmbed.addFields([
                { name: "Old color", value: `\`${oldRole.hexColor}\``, inline: true },
                { name: "New color", value: `\`${newRole.hexColor}\``, inline: true }
            ])
        }
        if (oldRole.hoist != newRole.hoist) {
            if (newRole.hoist) {
                logEmbed.addFields([
                    { name: "Display mode", value: `\`Role will now be shown in a separate category\``, inline: true }
                ])
            }
            else {
                logEmbed.addFields([
                    { name: "Display mode", value: `\`Role will no longer be shown in a separate category\``, inline: true }
                ])
            }
        }
        if (oldRole.permissions != newRole.permissions) {
            logEmbed.addFields([
                { name: "Permissions", value: `\`Permissions have been updated\``, inline: true }
            ])
        }
        if (oldRole.position != newRole.position) {
            logEmbed.addFields([
                { name: "Position", value: `\`Sorting position has been updated\``, inline: true }
            ])
        }

        // Send the log embed
        const channel = newChannel.guild.channels.cache.find(c => c.id == DiscordLogger.Default);
        await DiscordLogger.Log(channel, logEmbed);
    }
}