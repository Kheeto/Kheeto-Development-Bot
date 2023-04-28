const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "verify",
    description: "Gives you the verified user role",
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    execute: async (interaction, client) =>
    {
        const role = interaction.guild.roles.cache.find(role => role.id == "");
        if (!role) {
            const errorEmbed = new EmbedBuilder()
            .setTitle("An error occured")
            .setDescription("Member verification is disabled in this server.")
            .setColor(0xf21b07);

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            return;
        }

        const member = interaction.member;

        if (member.roles.cache.has(role.id)) {
            const errorEmbed = new EmbedBuilder()
            .setTitle("An error occured")
            .setDescription("You are already verified within this server!")
            .setColor(0xf21b07);

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
            return;
        }

        member.roles.add(role);

        const verifiedEmbed = new EmbedBuilder()
        .setTitle("Verified")
        .setDescription("You are now verified within this server!")
        .setColor(0x32a852);

        await interaction.reply({ embeds: [verifiedEmbed], ephemeral: true });
    }
}