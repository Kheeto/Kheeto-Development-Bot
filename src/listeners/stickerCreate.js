const Logger = require("../Logger");
const DiscordLogger = require("../DiscordLogger");
const { EmbedBuilder } = require("@discordjs/builders");
const { TextChannel, VoiceChannel } = require("discord.js");

module.exports = {
    name: 'stickerCreate',
    async execute(sticker, client)
    {
        const logEmbed = new EmbedBuilder()
        .setTitle("Sticker was created")
        .setColor(0xab6ad9)
        .setTimestamp()
        .addFields({ name: "Name", value: `\`${sticker.name}\``, inline: true });

        if (sticker.description) {
            logEmbed.addFields({ name: "Description", value: `\`\`\`${sticker.description}\`\`\``, inline: false })
        }

        // Send the log embed
        const channel = sticker.guild.channels.cache.find(c => c.id == DiscordLogger.Action);
        await DiscordLogger.Log(channel, logEmbed);
    }
}