const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder, SlashCommandBuilder } = require("@discordjs/builders");
const DiscordLogger = require("../DiscordLogger");
const fs = require("fs");
const { moderationLogEnabled, moderationSendInBothChannels } = require("../../config/config.json");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member.')
    .addMentionableOption(option =>
        option.setName('target').setDescription('The user you are going to warn.'))
    .addStringOption(option =>
        option.setName('reason').setDescription('The reason you are warning this user.'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
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
        const reason = interaction.options.get('reason')?.value || "No reason provided.";
        const member = await interaction.guild.members.fetch(targetUserId);
        if (!member) {
            await interaction.editReply({ content: "Error: User not found", ephemeral: true });
            return;
        }

        const data = fs.readFileSync("./config/warns.json");
        const jsonData = JSON.parse(data);
        
        if (jsonData[targetUserId]) jsonData[targetUserId]++;
        else jsonData[targetUserId] = 1;

        fs.writeFileSync("./config/warns.json", JSON.stringify(jsonData));
        
        const warnEmbed = new EmbedBuilder()
        .setTitle("Warn result")
        .addFields(
            { name: "Target:", value: `\`${member.user.tag}\``, inline: true },
            { name: "Moderator:", value: `\`${interaction.user.tag}\``, inline: true },
            { name: "Reason:", value: `${reason}`, inline: false })
        .setThumbnail(member.displayAvatarURL())
        .setColor(0xbcbd7e)
        .setTimestamp();

        await interaction.reply({ content: `Successfully warned ${member}`, ephemeral: true });

        const logChannel = interaction.guild.channels.cache.find(c => c.id == DiscordLogger.Moderation);
        await DiscordLogger.Log(logChannel, warnEmbed);

        if (!moderationLogEnabled || moderationSendInBothChannels) {
            await interaction.channel.send({ embeds: [ warnEmbed ] });
        }
    },
}