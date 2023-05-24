const Logger = require("../Logger");
const DiscordLogger = require("../DiscordLogger");
const { EmbedBuilder } = require("@discordjs/builders");
const { autoRolesEnabled, autoRolesList, welcomeMessageEnabled, welcomeMessageChannel } = require("../../config/config.json");

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

        // Log bot addition
        if (member.user.bot) {
            const botEmbed = new EmbedBuilder()
            .setTitle("Bot was added")
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