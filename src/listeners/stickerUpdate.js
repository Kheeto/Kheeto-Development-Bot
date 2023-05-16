const Logger = require("../Logger");
const DiscordLogger = require("../DiscordLogger");
const { EmbedBuilder } = require("@discordjs/builders");
const { TextChannel, VoiceChannel } = require("discord.js");

module.exports = {
    name: 'stickerUpdate',
    async execute(oldSticker, newSticker, client)
    {
        const logEmbed = new EmbedBuilder()
        .setTitle("Sticker was updated")
        .setColor(0xab6ad9)
        .setTimestamp();

        if (oldSticker.name != newSticker.name) {
            logEmbed.addFields([
                { name: "Old name", value: `\`${oldSticker.name}\``, inline: true },
                { name: "New name", value: `\`${newSticker.name}\``, inline: true }
            ]);
        }
        else {
            logEmbed.addFields([
                { name: "Name", value: `\`${oldSticker.name}\``, inline: true }
            ]);
        }

        if (oldSticker.description != newSticker.description) {
            logEmbed.addFields([
                { name: "Old description", value: `\`\`\`${oldSticker.description}\`\`\``, inline: true },
                { name: "New description", value: `\`\`\`${newSticker.description}\`\`\``, inline: true }
            ]);
        }

        // Send the log embed
        const channel = newSticker.guild.channels.cache.find(c => c.id == DiscordLogger.Default);
        await DiscordLogger.Log(channel, logEmbed);
    }
}