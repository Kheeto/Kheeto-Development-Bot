const Logger = require("../Logger");
const process = require("node:process");

async function handleErrors()
{
    // Error handling (prevent the bot from crashing)
    process.on('unhandledRejection', async (reason, promise) => {
        Logger.Error(`Unhandled rejection at: \"${promise}\", reason: \"${reason}\"`);
    });
    process.on('uncaughtException', (err) => {
        Logger.Error(`Uncaught exception: \"${err}\"`);
    });
    process.on('uncaughtExceptionMonitor', (err, origin) => {
        Logger.Error(`Uncaught exception monitor: \"${err}\", origin: \"${origin}\"`);
    });
}

module.exports = { handleErrors };