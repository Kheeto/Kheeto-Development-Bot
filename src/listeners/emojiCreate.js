const Logger = require("../Logger");
const DiscordLogger = require("../DiscordLogger");
const { EmbedBuilder } = require("@discordjs/builders");
const { TextChannel, VoiceChannel } = require("discord.js");

module.exports = {
    name: 'emojiCreate',
    async execute(emoji, client)
    {
        const logEmbed = new EmbedBuilder()
        .setTitle("Emoji was created")
        .setColor(0x3471eb)
        .setTimestamp()
        .addFields([
            { name: "Name", value: `\`${emoji.name}\``, inline: true },
            { name: "Author", value: `\`${emoji.fetchAuthor().tag}\``, inline: true },
            { name: "Animated", value: `\`${emoji.animated}\``, inline: true }
        ]);

        // Send the log embed
        const channel = emoji.guild.channels.cache.find(c => c.id == DiscordLogger.Default);
        await DiscordLogger.Log(channel, logEmbed);
    }
}