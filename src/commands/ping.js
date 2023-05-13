const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const fs = require("fs");
const Logger = require("../Logger");
const ms = require("ms");

module.exports = {
    name: "ping",
    description: "Returns the bot latency in ms",
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    execute: async (interaction, client) =>
    {
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        const pingEmbed = new EmbedBuilder()
            .setTitle(":ping_pong: Bot Latency")
            .addFields(
                { name: "Client ping", value: "`"+ping+"ms`", inline: true },
                { name: "Websocket ping", value: "`"+client.ws.ping+"ms`", inline: true })
            .setFooter({ text: "Command executed by " + interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        interaction.editReply({ embeds: [pingEmbed] });
    }
}