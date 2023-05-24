const Logger = require("../Logger");
const DiscordLogger = require("../DiscordLogger");
const { EmbedBuilder } = require("@discordjs/builders");
const { leaveMessageChannel, leaveMessageEnabled } = require("../../config/config.json");

module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client)
    {
        // Send a message when a user leaves the server
        if (leaveMessageEnabled)
        {
            const leaveEmbed = new EmbedBuilder()
            .setTitle(`Goodbye, ${member.user.tag}`)
            .setDescription("Hopefully you had a great time in of our server!")
            .setColor(0xeb4034)
            .setThumbnail(member.displayAvatarURL());

            const channel = member.guild.channels.cache.find(c => c.id == leaveMessageChannel);
            await channel.send({ embeds: [leaveEmbed] });
        }

        // Log bot removal
        if (member.user.bot) {
            const botEmbed = new EmbedBuilder()
            .setTitle("Bot was removed")
            .setColor(0x42f5d4)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp()
            .addFields([
                { name: "Bot name", value: member.user.tag, inline: true }
            ])

            const logChannel = member.guild.channels.cache.find(c => c.id == DiscordLogger.Action);
            await DiscordLogger.Log(logChannel, botEmbed);
        }
    }
}