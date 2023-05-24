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

        try {
            const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                .setCustomId("roleSelectionMenu")
                .setMinValues(0)
                .setMaxValues(2)
                .setPlaceholder("Nothing selected")
                .addOptions(
                    {
                        label: 'First role',
                        description: "Select the first role",
                        value: "first_role",
                    },
                    {
                        label: 'Second role',
                        description: "Select the second role",
                        value: "second_role",
                    }
                ),
            );

            const embed = new EmbedBuilder()
            .setTitle("Role selection")
            .setDescription("Pick the roles you want to have!");

            await interaction.channel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: "Successfully created a new role selection panel!", ephemeral: true });
        }
        catch (err) {
            console.log(err);
        }
    }
}