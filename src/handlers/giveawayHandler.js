const Logger = require("../Logger");
const { GiveawaysManager } = require("discord-giveaways");
const GiveawayManager = require('../giveaways');

function handleGiveaways(client)
{
    client.giveawayManager = new GiveawaysManager(client, {
        default: {
            botsCanWin: false,
            embedColor: `#5865F2`,
            embedColorEnd: `#f21b07`,
            reaction: `🎉`
        }
    });
    Logger.Info("[SETUP] Successfully created giveaway manager instance")
}

module.exports = { handleGiveaways };