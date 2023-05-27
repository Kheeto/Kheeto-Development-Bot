const { Routes } = require("discord.js");
const Logger = require("../Logger");
const { REST } = require("@discordjs/rest");
require("colors");

function loadCommands(client)
{
    const ascii = require('ascii-table');
    const fs = require('fs');
    const table = new ascii().setHeading("Command", "Status");
    
    client.commandArray = [];

    Logger.Info("[SETUP] Loading Commands");
    const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));
    for (const file of commandFiles)
    {
        try {
            const command = require(`../commands/${file}`);
            client.commands.set(command.data.name, command);
            client.commandArray.push(command.data.toJSON());
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                table.addRow(file, "Ready");
            } else {
                Logger.Warning(`[WARNING] The command ${file} is missing a required "data" or "execute" property.`);
                table.addRow(file, "Invalid data");
            }
        } catch (err) {
            table.addRow(file, "Couldn't load");
            Logger.Error(`[ERROR] Couldn't load command ${file}`);
            Logger.Error(err.stack);
        }
    }

    console.log(table.toString());
    Logger.Info("[SETUP] All command files are ready");

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    (async () => {
        try {
            Logger.Info("[SETUP] Refreshing application commands");

            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID), {
                    body: client.commandArray
                },
            );

            Logger.Success("[SETUP] Successfully reloaded application commands");
        } catch (err) {
            Logger.Error(err.stack);
        }
    })();
}

module.exports = { loadCommands };