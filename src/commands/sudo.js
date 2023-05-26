const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require("@discordjs/builders");
const Logger = require("../Logger");
const DiscordLogger = require("../DiscordLogger");

module.exports = {
    name: 'sudo',
    description: 'Write a message as another member.',
    options: [
    {
        name: 'target',
        description: 'The member you are going to impersonate.',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
    },
    {
        name: 'message',
        description: 'The message you are going to send.',
        type: ApplicationCommandOptionType.String,
        required: true,
    },
    ],
    defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
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

        const user = interaction.options.get('target').value;
        const message = interaction.options.get('message').value;

        const member = await interaction.guild.members.fetch(user);
        if (!member) {
            await interaction.editReply({ content: "Error: User not found in this guild", ephemeral: true });
            return;
        }

        await interaction.channel.createWebhook({
            name: member.displayName,
            avatar: member.displayAvatarURL({ dynamic: true })
        }).then((webhook) => {
            webhook.send({ content: message });
            setTimeout(() => {
                webhook.delete();
            }, 3000); // Delete webhook after 3 seconds
        })

        await interaction.reply({ content: `Successfully wrote a message as ${member}`, ephemeral: true });
    },
}