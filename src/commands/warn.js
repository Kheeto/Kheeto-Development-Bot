const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require("@discordjs/builders");
const fs = require("fs");

module.exports = {
    name: 'warn',
    description: 'Warn a member.',
    options: [
    {
        name: 'target',
        description: 'The user you are going to warn.',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
    },
    {
        name: 'reason',
        description: 'The reason you are warning this user.',
        type: ApplicationCommandOptionType.String,
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

        const data = fs.readFileSync("./config/warns.json");
        const jsonData = JSON.parse(data);
        
        if (jsonData[targetUserId]) jsonData[targetUserId]++;
        else jsonData[targetUserId] = 1;

        fs.writeFileSync("./config/warns.json", JSON.stringify(jsonData));

        await interaction.reply({ content: `Successfully warned ${targetUserId}`, ephemeral: true });
    },
}