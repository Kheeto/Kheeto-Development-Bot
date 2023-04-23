const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, } = require('discord.js');
const Logger = require("../Logger");

module.exports = {
    name: 'kick',
    description: 'Kick a member from this server.',
    options: [
    {
        name: 'target',
        description: 'The user you are going to kick.',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
    },
    {
        name: 'reason',
        description: 'The reason you are kicking this user.',
        type: ApplicationCommandOptionType.String,
    },
    ],
    permissionsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers],
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
        const reason =
        interaction.options.get('reason')?.value || 'No reason provided.';

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            await interaction.editReply("That user doesn't exist in this server.");
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply(
                "You can't kick that user because they're the server owner."
            );
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply(
                "You can't kick that user because they have the same/higher role than you."
            );
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply(
                "I can't kick that user because they have the same/higher role than me."
            );
            return;
        }

        try {
            await targetUser.kick({ reason });
            await interaction.editReply(
                `User ${targetUser} was kicked\nReason: ${reason}`
            );
        } catch (err) {
            Logger.Error(`[ERROR] There was an issue kicking a member: ${err}`);
        }
    },
}