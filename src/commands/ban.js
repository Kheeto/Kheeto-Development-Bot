const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const Logger = require("../Logger");
  
module.exports = {
    name: 'ban',
    description: 'Ban a member from this server.',
    options: [
    {
        name: 'target',
        description: 'The user you are going to ban.',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
    },
    {
        name: 'reason',
        description: 'The reason you are banning this user.',
        type: ApplicationCommandOptionType.String,
    },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    execute: async (interaction, client) => {
        if (!interaction.inGuild()) {
            interaction.reply('This command can only be executed in a server.');
            return;
        }

        const targetUserId = interaction.options.get('target').value;
        const reason = interaction.options.get('reason')?.value || 'No reason provided.';

        await interaction.deferReply({
            ephemeral: true
        });

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            await interaction.editReply({
                content: "Error: That user was not found in this server.",
                ephemeral: true
            });
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply({
                content: "Error: You can't ban that user because they're the server owner.",
                ephemeral: true
            });
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply({
                content: "Error: You can't ban that user because their role priority is equal or higher than yours.",
                ephemeral: true
            });
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply({
                content: "Error: I can't ban that user because their role priority is equal or higher than mine.",
                ephemeral: true
            });
            return;
        }

        try {
            await targetUser.ban({ reason });

            const banEmbed = new EmbedBuilder()
                .setTitle("Ban result")
                .addFields(
                    { name: "Target:", value: `\`${targetUser.user.tag}\``, inline: true },
                    { name: "Moderator:", value: `\`${interaction.user.tag}\``, inline: true },
                    { name: "Reason:", value: `${reason}`, inline: false })
                .setThumbnail(targetUser.displayAvatarURL());

            await interaction.editReply({
                content: `${targetUser} was successfully banned from this server.`,
                ephemeral: true
            });

            interaction.channel.send({ embeds: [banEmbed] });
        } catch (err) {
            Logger.Error(`[ERROR] There was an issue banning a member: ${err}`);
        }
    },
};