require('dotenv/config');
const Logger = require("../Logger");
const { EmbedBuilder } = require('@discordjs/builders');
const { ChannelType, OverwriteType, PermissionsBitField } = require('discord.js');

const joinToCreateID = "1099334494567268395";
const customChannelCategory = "1099334494567268393";
var customChannels = [];

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client)
    {
        // Check if a user joined a channel
        if (newState.channel != null) {
            // Check if the joined channel is the "join to create"
            if (newState.channelId == joinToCreateID) {
                const customChannel = await newState.guild.channels.create({
                    name: `👥 ${newState.member.displayName}`,
                    type: ChannelType.GuildVoice,
                    parent: customChannelCategory,
                    permissionOverwrites: [
                        {
                            id: newState.member.user.id,
                            allow:
                            [ PermissionsBitField.Flags.ViewChannel,
                              PermissionsBitField.Flags.ManageChannels,
                              PermissionsBitField.Flags.Connect,
                              PermissionsBitField.Flags.UseSoundboard,
                              PermissionsBitField.Flags.ManageRoles,
                              PermissionsBitField.Flags.PrioritySpeaker,
                              PermissionsBitField.Flags.Speak,
                              PermissionsBitField.Flags.CreateInstantInvite,
                              PermissionsBitField.Flags.Stream,
                              PermissionsBitField.Flags.UseEmbeddedActivities,
                              PermissionsBitField.Flags.SendMessages,
                              PermissionsBitField.Flags.ManageMessages
                            ],
                            type: OverwriteType.Member
                        },
                        {
                            id: newState.guild.roles.everyone,
                            allow: [ PermissionsBitField.Flags.Speak, PermissionsBitField.Flags.SendMessages ],
                            deny: [ PermissionsBitField.Flags.Connect ],
                            type: OverwriteType.Role
                        }
                    ]
                });
                await newState.setChannel(customChannel, "User created a custom voice channel");
                customChannels.push(customChannel.id);

                const welcomeEmbed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle("Custom channel")
                .setDescription("This is your own custom channel that you just created. You have been granted full permissions to decide which people can join it and what they can do.")
                .addFields([
                    { name: "How can i let people join?", value: "Hover on your voice channel and click the gear icon, go to permissions and you can add a user or role that you want to join, just grant them the \"Connect\" permission", inline: false }
                ])
                .setFooter({ text: `Channel created by ${newState.member.user.tag}`, iconURL: newState.member.displayAvatarURL() });

                await customChannel.send({ embeds: [welcomeEmbed] });
            }
        }
        // Check if a user left a temporary channel
        if (oldState.channel != null) {
            if (customChannels.includes(oldState.channelId)) {
                // Delete the temporary channel if it's empty
                if (oldState.channel.members.size == 0) {
                    await oldState.channel.delete();
                }
            }
        }
    }
}