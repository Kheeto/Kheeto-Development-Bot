const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('@discordjs/builders');
const { ButtonStyle, ChannelType, PermissionsBitField, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('verifypanel')
    .setDescription('Create a new verification panel in the current channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
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
            .setCustomId('verifyButton')
            .setLabel('Verify yourself')
            .setStyle(ButtonStyle.Success),
        )

        const embed = new EmbedBuilder()
        .setColor(0x32a852)
        .setTitle("Verifying")
        .setDescription("Click the button below to verify your account and access the server channels.");

        await interaction.channel.send({ embeds: [embed], components: [button] });
        await interaction.reply({ content: "Successfully created a new verification panel!", ephemeral: true });
    }
}