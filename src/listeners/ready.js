const Logger = require("../Logger");
const { ActivityType } = require('discord.js');
const { statusText, statusType } = require('../../config/config.json');

module.exports = {
    name: 'ready',
    once: true,
    execute(client)
    {
        Logger.Info("[SETUP] Setting rich presence and getting the bot ready");
        client.user.setPresence({
            activities: [
                {
                    name: statusText,
                    type: ActivityType.Watching
                }
            ],
            status: statusType,
        });
        Logger.Success(`[INFO] Bot is now online! Logged in as ${client.user.username}`);
    },
};