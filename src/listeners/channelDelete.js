const Logger = require("../Logger");
const DiscordLogger = require("../DiscordLogger");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    name: 'channelDelete',
    async execute(channel, client)
    {
        const logEmbed = new EmbedBuilder()
        .setTitle("A channel has been deleted")
        .setTimestamp();

        if (channel.isText()) {
            logEmbed.addFields([
                { name: "Type", value: `\`Text channel\``, inline: true },
                { name: "Channel name", value: channel.name, inline: true },
                { name: "Category", value: channel.parent.name, inline: true }
            ]);
            await DiscordLogger.Log(DiscordLogger.Default, logEmbed);
        }
        else if (channel.isVoice()) {
            logEmbed.addFields([
                { name: "Type", value: `\`Voice channel\``, inline: true },
                { name: "Channel name", value: channel.name, inline: true },
                { name: "Category", value: channel.parent.name, inline: true }
            ]);
            await DiscordLogger.Log(DiscordLogger.Default, logEmbed);
        }
    }
}