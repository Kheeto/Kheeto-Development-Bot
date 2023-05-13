const Logger = require("../Logger");
const DiscordLogger = require("../DiscordLogger");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    name: 'channelCreate',
    async execute(channel, client)
    {
        const logEmbed = new EmbedBuilder()
        .setTitle("Channel was created")
        .setColor(0x6ffc03)
        .setTimestamp()
        .addFields([
            { name: "Channel name", value: `\`${channel.name}\``, inline: true },
            { name: "Category", value: `\`${channel.parent.name}\``, inline: true }
        ]);

        // Send the log embed
        const logChannel = channel.guild.channels.cache.find(c => c.id == DiscordLogger.Default);
        await DiscordLogger.Log(logChannel, logEmbed);
    }
}