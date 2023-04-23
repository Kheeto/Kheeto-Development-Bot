const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const fs = require("fs");
const Logger = require("../Logger");
const ms = require("ms");

const enableLogChannel = false;

module.exports = {
    name: "timeout",
    description: "Timeout the specified user for a certain amount of time",
    options: [
        {
            name: "user",
            description: "The user you are timing out",
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: "duration",
            description: "How long it will last (Format example: 5d 2h)",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "reason",
            description: "Why you are timing out this user",
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.ModerateMembers],
    botPermissions: [PermissionFlagsBits.ModerateMembers],
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    execute: async (interaction, client) => {
        if (!interaction.inGuild()) {
            interaction.reply('This command can only be executed in a server.');
            return;
        }

        const user = interaction.options.get("user").value;
        var duration = interaction.options.get("duration").value;
        const reason = interaction.options.get("reason")?.value || "No reason provided.";

        await interaction.deferReply();

        const member = await interaction.guild.members.fetch(user);
        if (!member) {
            await interaction.editReply({ content: "Error: User not found", ephemeral: true });
            return;
        }

        if (member.user.bot) {
            await interaction.editReply({ content: "Error: I can't timeout a bot", ephemeral: true });
        }

        duration = ms(duration);
        if (isNaN(duration)) {
            await interaction.editReply({ content: "Error: The duration you entered is invalid", ephemeral: true });
            return;
        }

        const minDuration = 5000;
        const maxDuration = 2.419e9;
        if (duration < minDuration || duration > maxDuration) {
            const { default: prettyMs } = await import('pretty-ms');
            await interaction.editReply({ content: `The duration must be between ${prettyMs(minDuration)} and ${prettyMs(maxDuration)}.` });
            return;
        }

        const staffRolePosition = interaction.member.roles.highest.position;
        const targetRolePosition = member.roles.highest.position;

        if (targetRolePosition >= staffRolePosition) {
            await interaction.editReply({ content: "You can't perform this action on a user with a higher or equal priority to yours", ephemeral: true });
            return;
        }

        try {
            const { default: prettyMs } = await import('pretty-ms');

            await member.timeout(duration, reason);
            await interaction.editReply({ content: `You put ${member} in timeout for ${duration}` });

            if (enableLogChannel) {
                const channel = interaction.guild.channels.fetch("1099396020892336208");
                const embed = new EmbedBuilder()
                    .setTitle("Timeout")
                    .addFields(
                        { name: "Target", value: "`"+member.username+"#"+member.discriminator+"`", inline: true },
                        { name: "Duration", value: "`"+prettyMs(duration)+"`", inline: true },
                        { name: "Reason", value: "`"+duration+"`" })
                    .addFooter({ text: interaction.member.username+"#"+interaction.member.discriminator, iconURL: interaction.member.displayAvatarURL() })
                    .setColor("#383231");

                channel.send({ embeds: [ embed ] })
            }
        }
        catch (err)
        {
            Logger.Error(`[ERROR] There was an issue timing out a member: ${err}`);
        }
    }
}