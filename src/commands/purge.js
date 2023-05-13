const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const { moderationLogEnabled, moderationLogChannel, moderationLogPurge } = require("../../config/config.json");

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
        .setDescription(`${size} messages have been deleted`)
        .setTimestamp();

        await interaction.reply({ embeds: [ purgeEmbed ], ephemeral: true });

        if (moderationLogEnabled && moderationLogPurge) {
            const purgeLogEmbed = new EmbedBuilder()
            .setTitle("Purge result")
            .addFields([
                { name: "Message amount:", value: `\`${size} messages\``, inline: true },
                { name: "Moderator:", value: `\`${interaction.member.user.tag}\``, inline: true }
            ])
            .setThumbnail(interaction.member.displayAvatarURL())
            .setTimestamp();

            const channel = interaction.guild.channels.fetch(moderationLogChannel);
            await channel.send({ embeds: [ purgeLogEmbed ] })
        }
    }
}