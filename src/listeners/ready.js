const Logger = require("../Logger");
const { ActivityType } = require('discord.js');
const { statusText, statusType } = require('../../config/config.json');
require('dotenv').config();
const mongoose = require('mongoose');
const mongodb = process.env.MONGODB;

module.exports = {
    name: 'ready',
    once: true,
    async execute(client)
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

        // Connect to database
        if (!mongodb) {
            return Logger.Error("[ERROR] MONGODB environment variable is missing in the .env file - Couldn't connect to the database!");
        }
        await mongoose.connect(mongodb || '', {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        if (mongoose.connect) {
            Logger.Success("[INFO] Connected to database.");
        }
    },
};