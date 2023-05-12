const Logger = require("../Logger");
const { EmbedBuilder } = require("@discordjs/builders");

const autoRolesEnabled = false;
const autoRolesList = [""];

const welcomeMessageEnabled = false;
const welcomeMessageChannel = "";

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client)
    {
        // Auto roles
        if (autoRolesEnabled) {
            Logger.Info(`[AUTOROLES] Adding join auto roles to ${member.user.tag}`);
            autoRolesList.forEach(async (role) => {
                //Logger.Info(`[AUTOROLES] Adding role ${member.guild.roles.cache.get(role).name} to ${member.user.tag}`);
                await member.roles.add(role);
            });
        }

        // Send a message when a user joins the server
        if (welcomeMessageEnabled)
        {
            const welcomeEmbed = new EmbedBuilder()
            .setTitle(`Welcome, ${member.user.tag}`)
            .setDescription("Welcome to our server, please read the rules and to have fun!")
            .setColor(0x52fc03)
            .setThumbnail(member.displayAvatarURL());

            const channel = member.guild.channels.cache.find(c => c.id == welcomeMessageChannel);
            await channel.send({ embeds: [welcomeEmbed] });
        }
    }
}