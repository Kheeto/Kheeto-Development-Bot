const Logger = require("../Logger");
const DiscordLogger = require("../DiscordLogger");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    name: 'channelCreate',
    async execute(channel, client)
    {
        const logEmbed = new EmbedBuilder()
        .setTitle("A channel has been created")
        .setTimestamp();

        if (channel.isText()) {
            logEmbed.addFields([
                { name: "Type", value: `\`Text channel\``, inline: true },
                { name: "Channel", value: channel, inline: true },
                { name: "Category", value: channel.parent.name, inline: true }
            ]);
            await DiscordLogger.Log(DiscordLogger.Default, logEmbed);
        }
        else if (channel.isVoice()) {
            logEmbed.addFields([
                { name: "Type", value: `\`Text channel\``, inline: true },
                { name: "Channel", value: channel, inline: true },
                { name: "Category", value: channel.parent.name, inline: true }
            ]);
            await DiscordLogger.Log(DiscordLogger.Default, logEmbed);
        }
    }
}