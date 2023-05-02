const Logger = require("../Logger");
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client)
    {
        Logger.Info("[SETUP] Setting rich presence and getting the bot ready");
        client.user.setPresence({
            activities: [
                {
                    name: "kheeto.dev",
                    type: ActivityType.Watching
                }
            ],
            status: "online",
        });
        Logger.Success(`[INFO] Bot is now online! Logged in as ${client.user.username}`);
    },
};