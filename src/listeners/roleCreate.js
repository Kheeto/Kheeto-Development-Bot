const Logger = require("../Logger");
const DiscordLogger = require("../DiscordLogger");
const { EmbedBuilder } = require("@discordjs/builders");
const { TextChannel, VoiceChannel } = require("discord.js");

module.exports = {
    name: 'roleCreate',
    async execute(role, client)
    {
        const logEmbed = new EmbedBuilder()
        .setTitle("Role was created")
        .setColor(0x6ffc03)
        .setTimestamp()
        .addFields([
            { name: "Role name", value: `\`${role.name}\``, inline: true },
            { name: "Color", value: `\`${role.hexColor}\``, inline: true }
        ]);

        // Send the log embed
        const channel = newChannel.guild.channels.cache.find(c => c.id == DiscordLogger.Default);
        await DiscordLogger.Log(channel, logEmbed);
    }
}