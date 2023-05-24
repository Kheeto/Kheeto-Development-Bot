const Logger = require("../Logger");
const DiscordLogger = require("../DiscordLogger");
const { EmbedBuilder } = require("@discordjs/builders");
const { TextChannel, VoiceChannel } = require("discord.js");

module.exports = {
    name: 'stickerDelete',
    async execute(sticker, client)
    {
        const logEmbed = new EmbedBuilder()
        .setTitle("Sticker was deleted")
        .setColor(0xab6ad9)
        .setTimestamp()
        .addFields([
            { name: "Name", value: `\`${sticker.name}\``, inline: true }
        ]);

        // Send the log embed
        const channel = sticker.guild.channels.cache.find(c => c.id == DiscordLogger.Action);
        await DiscordLogger.Log(channel, logEmbed);
    }
}