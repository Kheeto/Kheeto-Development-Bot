const { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    name: "say",
    description: "The bot will write a message with the content you provided",
    options: [
        {
            name: "message",
            description: "The message the bot will send",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    defaultMemberPermissions: [PermissionFlagsBits.ModerateMembers],
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