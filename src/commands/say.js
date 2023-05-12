const { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

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
    execute: async (interaction, client) => {
        const content = interaction.options.get("message").value;

        await interaction.reply({ content: "Writing your message...", ephemeral: true });
        await interaction.deleteReply();

        interaction.channel.send(content);
    }
}