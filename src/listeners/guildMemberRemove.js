const Logger = require("../Logger");
const { EmbedBuilder } = require("@discordjs/builders");

const leaveMessageEnabled = false;
const leaveMessageChannel = "";

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
    }
}