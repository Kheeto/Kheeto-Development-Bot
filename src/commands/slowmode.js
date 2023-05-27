const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const Logger = require("../Logger");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Sets the slowmode of the current channel.')
    .addIntegerOption(option =>
        option.setName('cooldown').setDescription('The new slowmode time').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
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
        
        const cooldown = interaction.options.get("cooldown").value;

        interaction.channel.setRateLimitPerUser(cooldown).catch(err => {
            return Logger.Error(err.stack);
        });

        const slowmodeEmbed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("Slowmode was set")
        .addFields(
            { name: "Cooldown", value: `${cooldown} seconds`, inline: true }
        )
        .setTimestamp();
        
        await interaction.reply({ embeds: [slowmodeEmbed] })
    }
}