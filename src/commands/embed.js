const { EmbedBuilder } = require('@discordjs/builders');
const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const Logger = require("../Logger");

module.exports = {
    name: "embed",
    description: "Loads an embed from a JSON file and sends it in the current channel",
    options: [
        {
            name: "name",
            description: "The name of the embed JSON file (including .json)",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.ManageGuild],
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    execute: async (interaction, client) => {
        const name = interaction.options.get("name").value;

        if (!name.includes(".json")) {
            await interaction.reply({ content: "The embed file name must include the .json extension", ephemeral: true });
            return;
        }

        try {
            if (fs.existsSync("./src/embeds/" + name)) {
                await interaction.reply({ content: `Sending the ${name} embed...`, ephemeral: true });
            }
            else {
                await interaction.reply({ content: "The embed file you provided was not found", ephemeral: true });
                return;
            }
        }
        catch (err) {
            Logger.Error(err);
        }

        const embed = new EmbedBuilder();

        try {
            const jsonData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../embeds/' + name)));
            interaction.channel.send({ embeds: [jsonData] });
        }
        catch (err) {
            interaction.followUp({ content: err.toString() + "\nAsk the bot developer to check the console so he can see the issue.", ephemeral: true });
            Logger.Error(err);
        }
    }
}