const Logger = require("../Logger");

function loadCommands(client)
{
    const ascii = require('ascii-table');
    const fs = require('fs');
    const table = new ascii().setHeading("Command", "Status");
    
    var commands = [];

    Logger.Info("[SETUP] Loading Commands");
    const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));
    for (const file of commandFiles)
    {
        const command = require(`../commands/${file}`);
        client.commands.set(command.name, command);
        commands.push(command);
        table.addRow(file, "Loaded");
    }

    client.application.commands.set(commands);
    console.log(table.toString());
    Logger.Info("[SETUP] Finished registering slash commands");
}

module.exports = { loadCommands };