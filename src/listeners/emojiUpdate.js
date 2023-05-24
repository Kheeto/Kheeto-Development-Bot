const Logger = require("../Logger");
const DiscordLogger = require("../DiscordLogger");
const { EmbedBuilder } = require("@discordjs/builders");
const { TextChannel, VoiceChannel } = require("discord.js");

module.exports = {
    name: 'emojiUpdate',
    async execute(oldEmoji, newEmoji, client)
    {
        const logEmbed = new EmbedBuilder()
        .setTitle("Emoji was updated")
        .setColor(0x3471eb)
        .setTimestamp();

        if (oldEmoji.name != newEmoji.name) {
            logEmbed.addFields([
                { name: "Old name", value: `\`${oldEmoji.name}\``, inline: true },
                { name: "New name", value: `\`${newEmoji.name}\``, inline: true }
            ]);
        }
        else {
            logEmbed.addFields({ name: "Name", value: `\`${newEmoji.name}\``, inline: true });
        }

        if (newEmoji.animated) {
            logEmbed.addFields({ name: "Animated", value: `\`${newEmoji.animated}\``, inline: true });
        }

        // Send the log embed
        const channel = newEmoji.guild.channels.cache.find(c => c.id == DiscordLogger.Action);
        await DiscordLogger.Log(channel, logEmbed);
    }
}