const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require("@discordjs/builders");
const fs = require("fs");

module.exports = {
    name: 'warnings',
    description: 'Check how much warnings a member has.',
    options: [
    {
        name: 'target',
        description: 'The user you are checking the warnings of.',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
    }
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
        const member = await interaction.guild.members.fetch(targetUserId);
        if (!member) {
            await interaction.editReply({ content: "Error: User not found", ephemeral: true });
            return;
        }

        const data = fs.readFileSync("./config/warns.json");
        const jsonData = JSON.parse(data);
        const amount = jsonData[targetUserId] || 0;
        
        const warningsEmbed = new EmbedBuilder()
        .setTitle("Warnings")
        .addFields([
            { name: "Target:", value: `\`${member.user.tag}\``, inline: true },
            { name: "Amount:", value: `\`${amount} warnings\``, inline: true }
        ])
        .setThumbnail(member.displayAvatarURL())
        .setTimestamp();

        await interaction.reply({ embeds: [warningsEmbed], ephemeral: true });
    },
}