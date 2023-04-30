const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const Logger = require("../Logger");

module.exports = {
    name: "shutdown",
    description: "Shuts down the bot",
    permissionsRequired: [PermissionFlagsBits.ManageGuild],
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    execute: async (interaction, client) =>
    {
        await interaction.deferReply({ ephemeral: true});

        const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle("Shutdown")
        .setDescription("Your bot has been successfully shut down.");

        setTimeout(async () => {
            await interaction.editReply({ content: "", embeds: [embed] });
            await client.user.setStatus('invisible');
            Logger.Info("[INFO] Bot has been shut down through command.");
            process.exit();
        }, 1500);
    }
}