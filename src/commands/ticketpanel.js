const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle, ChannelType, PermissionsBitField, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "ticketpanel",
    description: "Create a new ticket panel in the current channel.",
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

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('openTicket')
            .setLabel('Create a Ticket')
            .setStyle(ButtonStyle.Primary),
        )

        const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("Open a Ticket")
        .setDescription("If you need support or you need to talk to the staff, click the button below to open a ticket.");

        await interaction.channel.send({ embeds: [embed], components: [button] });
        await interaction.reply({ content: "Successfully created a new ticket panel!", ephemeral: true });
    }
}