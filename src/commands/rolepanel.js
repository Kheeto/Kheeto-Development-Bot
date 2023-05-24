const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder } = require('@discordjs/builders');
const { ButtonStyle, ChannelType, PermissionsBitField, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "rolepanel",
    description: "Create a role selection panel in the current channel.",
    defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    execute: async (interaction, client) =>
    {
        if (!interaction.inGuild()) {
            const errorEmbed = new EmbedBuilder()
            .setTitle("An error occurred")
            .setDescription("This command can only be executed in a guild.")
            .setColor(0xf21b07);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }

        const row = new ActionRowBuilder();
        const selectionMenu = new SelectMenuBuilder()
        .setCustomId("roleSelectionMenu")
        .setPlaceholder("Select the roles you want to have!")
        .addOptions(
            {
                label: "First role",
                description: "Select the first role",
                value: "first_role",
            },
            {
                label: "Second role",
                description: "Select the second role",
                value: "second_role",
            },
            {
                name: "Third role",
                description: "Select the third role",
                value: "third_role",
            },
            {
                label: "Fourth role",
                description: "Select the fourth role",
                value: "fourth_role",
            },
            {
                name: "Fifth role",
                description: "Select the fifth role",
                value: "fifth_role",
            }
        );

        row.addComponents(selectionMenu);

        const embed = new EmbedBuilder()
        .setTitle("Role selection")
        .setDescription("You can select the roles you want to have and they will be added or removed to you!");

        await interaction.channel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: "Successfully created a new role selection panel!", ephemeral: true });
    }
}