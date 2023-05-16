const Logger = require("../Logger");

module.exports = {
    name: 'warn',
    execute(info, client)
    {
        Logger.Warning(`[WARN] ${info}`);
    },
};