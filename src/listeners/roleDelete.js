const Logger = require("../Logger");
const DiscordLogger = require("../DiscordLogger");
const { EmbedBuilder } = require("@discordjs/builders");
const { TextChannel, VoiceChannel } = require("discord.js");

module.exports = {
    name: 'roleDelete',
    async execute(role, client)
    {
        const logEmbed = new EmbedBuilder()
        .setTitle("Role was deleted")
        .setColor(0xfc4e03)
        .setTimestamp()
        .addFields([
            { name: "Role name", value: `\`${role.name}\``, inline: true }
        ]);

        // Send the log embed
        const channel = role.guild.channels.cache.find(c => c.id == DiscordLogger.Default);
        await DiscordLogger.Log(channel, logEmbed);
    }
}