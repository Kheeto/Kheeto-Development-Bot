const { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField, SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Write a message with the provided content.')
    .addStringOption(option =>
        option.setName('message').setDescription('The message the bot will send.').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
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

        const content = interaction.options.get("message").value;

        await interaction.reply({ content: "Writing your message...", ephemeral: true });
        await interaction.deleteReply();

        interaction.channel.send(content);
    }
}