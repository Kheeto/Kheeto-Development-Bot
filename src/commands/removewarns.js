const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require("@discordjs/builders");
const DiscordLogger = require("../DiscordLogger");
const fs = require("fs");
const { moderationLogEnabled, moderationSendInBothChannels } = require("../../config/config.json");

module.exports = {
    name: 'removewarns',
    description: 'Revoke warnings from a member.',
    options: [
    {
        name: 'target',
        description: 'The user you are removing warnings from.',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
    },
    {
        name: 'amount',
        description: 'The amount of warnings to remove.',
        type: ApplicationCommandOptionType.Integer,
        required: true
    },
    {
        name: 'reason',
        description: 'The reason you are removing these warnings.',
        type: ApplicationCommandOptionType.String
    },
    ],
    defaultMemberPermissions: [PermissionFlagsBits.ModerateMembers],
    /**
     * @param {Client} client
     * @param {Interaction} interaction
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

        const targetUserId = interaction.options.get('target').value;
        const amount = interaction.options.get('amount').value;
        const reason = interaction.options.get('reason')?.value || "No reason provided.";

        const member = await interaction.guild.members.fetch(targetUserId);
        if (!member) {
            await interaction.editReply({ content: "Error: User not found", ephemeral: true });
            return;
        }

        const data = fs.readFileSync("./config/warns.json");
        const jsonData = JSON.parse(data);
        
        // No warnings
        if (!jsonData[targetUserId] || jsonData[targetUserId] == 0) {
            const errorEmbed = new EmbedBuilder()
            .setTitle("An error occurred")
            .setDescription("The user you mentioned has no warnings.")
            .setColor(0xf21b07);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }

        const userWarnings = jsonData[targetUserId];
        var removedAmount = amount;
        if (userWarnings - amount < 0) {
            removedAmount += userWarnings - amount;
        }

        jsonData[targetUserId] -= removedAmount;
        const warningsLeft = jsonData[targetUserId];

        fs.writeFileSync("./config/warns.json", JSON.stringify(jsonData));
        
        const removeWarnEmbed = new EmbedBuilder()
        .setTitle("Warn removal result")
        .addFields(
            { name: "Target:", value: `\`${member.user.tag}\``, inline: true },
            { name: "Moderator:", value: `\`${interaction.user.tag}\``, inline: true },
            { name: "Warnings removed:", value: `\`${removedAmount} warnings\``, inline: true },
            { name: "Warnings left:", value: `\`${warningsLeft} warnings\``, inline: true },
            { name: "Reason:", value: `${reason}`, inline: true })
        .setThumbnail(member.displayAvatarURL())
        .setColor(0x4287f5)
        .setTimestamp();

        await interaction.reply({ content: `Successfully removed warnings from ${member}`, ephemeral: true });

        const logChannel = interaction.guild.channels.cache.find(c => c.id == DiscordLogger.Moderation);
        await DiscordLogger.Log(logChannel, removeWarnEmbed);

        if (!moderationLogEnabled || moderationSendInBothChannels) {
            await interaction.channel.send({ embeds: [ removeWarnEmbed ] });
        }
    },
}