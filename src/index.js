require("dotenv").config();
const fs = require("fs");
const Logger = require("./Logger");
const { Client, GatewayIntentBits, Routes, Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const { loadCommands } = require("./handlers/commandHandler");
const { loadEvents } = require("./handlers/eventHandler");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ]
});
client.commands = new Collection();

async function main() {
    try {
        Logger.Info("[SETUP] Starting the bot...");
        client.login(process.env.TOKEN).then(() => {
            loadEvents(client);
            loadCommands(client);
        });
    } catch(err) { return Logger.Error("[ERROR] There was an issue while starting the bot: " + err )}
    Logger.Info("[SETUP] Successfully logged into Discord");
}

main();