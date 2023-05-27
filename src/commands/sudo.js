const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require("@discordjs/builders");
const Logger = require("../Logger");
const DiscordLogger = require("../DiscordLogger");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('sudo')
    .setDescription('Write a message as another member.')
    .addMentionableOption(option =>
        option.setName('target').setDescription('The member you are going to impersonate.').setRequired(true))
    .addStringOption(option =>
        option.setName('message').setDescription('The message you are going to send.').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
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