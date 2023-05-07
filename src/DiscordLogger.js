const DefaultLog = ""; // Action log channel ID

async function LogEmbed(logChannel, embed) {
    await logChannel.send({ embeds: [embed] });
}

module.exports = {
    DefaultLog,
    LogEmbed,
}