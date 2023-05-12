const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    name: "purge",
    description: "Delete the provided amount of messages",
    options: [
        {
            name: "amount",
            description: "The amount of messages to delete",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    defaultMemberPermissions: [PermissionFlagsBits.ManageMessages],
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    execute: async (interaction, client) => {
        const amount = interaction.options.get("amount").value;

        const messages = await interaction.channel.messages.fetch({ limit: amount });
        const { size } = messages;

        messages.forEach((message) => message.delete());

        const purgeEmbed = new EmbedBuilder()
        .setTitle("Purge result")
        .setDescription(`${size} messages have been deleted`);

        await interaction.reply({ embeds: [ purgeEmbed ], ephemeral: true });
    }
}