const Logger = require("../Logger");
const { CommandInteraction } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    execute(interaction, client)
    {
        if (interaction.isChatInputCommand())
        {
            const command = client.commands.get(interaction.commandName);
            if (!command)
                return interaction.reply({ content: `Invalid command: ${interaction.commandName}`, ephemeral: true});
            
            Logger.Info(`[INFO] Command '${interaction.commandName}' is being executed by ${interaction.user.tag}`);
            command.execute(interaction, client);
        }
    }
}