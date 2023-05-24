const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const Logger = require("../Logger");
const { enableShutdownCommand } = require("../../config/config.json");

module.exports = {
    name: "shutdown",
    description: "Shuts down the bot",
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

        if (!enableShutdownCommand) {
            const disabledEmbed = new EmbedBuilder()
            .setTitle("Shutdown unavailable")
            .setDescription("This command was disabled in the bot config.")
            .setColor(0xf21b07);

            await interaction.reply({ embeds: [disabledEmbed], ephemeral: true });
            return;
        }

        await interaction.deferReply({ ephemeral: true});

        const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle("Shutdown")
        .setDescription("Your bot has been successfully shut down.")
        .setTimestamp();

        setTimeout(async () => {
            await interaction.editReply({ content: "", embeds: [embed] });
            await client.user.setStatus('invisible');
            Logger.Info("[INFO] Bot has been shut down through command.");
            process.exit();
        }, 1500);
    }
}