const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle, ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "verifypanel",
    description: "Create a new verification panel in the current channel.",
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    execute: async (interaction, client) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return await interaction.reply({ content: "You don't have the permission to use this command.", ephemeral: true });

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('verifyButton')
            .setLabel('Verify yourself')
            .setStyle(ButtonStyle.Success),
        )

        const embed = new EmbedBuilder()
        .setColor(0x32a852)
        .setTitle("Verifying")
        .setDescription("Click the button below to verify your account and access the server channels.");

        await interaction.reply({ embeds: [embed], components: [button] });
    }
}