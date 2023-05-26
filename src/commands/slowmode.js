const { EmbedBuilder } = require('@discordjs/builders');
const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const Logger = require("../Logger");

module.exports = {
    name: "slowmode",
    description: "Sets the slowmode of the current channel",
    options: [
        {
            name: "cooldown",
            description: "The time of the slowmode",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    defaultMemberPermissions: [PermissionFlagsBits.ManageChannels],
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