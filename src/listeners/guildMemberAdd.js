const Logger = require("../Logger");

const autoRolesEnabled = false;
const autoRolesList = [""];

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client)
    {
        // Auto roles
        if (autoRolesEnabled) {
            Logger.Info(`[AUTOROLES] Adding join auto roles to ${member.user.tag}`);
            autoRolesList.forEach(async (role) => {
                //Logger.Info(`[AUTOROLES] Adding role ${member.guild.roles.cache.get(role).name} to ${member.user.tag}`);
                await member.roles.add(role);
            });
        }
    }
}