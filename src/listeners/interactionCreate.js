const Logger = require("../Logger");
const { CommandInteraction, PermissionFlagsBits, ChannelType } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client)
    {
        // Slash commands
        if (interaction.isChatInputCommand())
        {
            const command = client.commands.get(interaction.commandName);
            if (!command)
                return interaction.reply({ content: `Invalid command: ${interaction.commandName}`, ephemeral: true});
            
            Logger.Info(`[INFO] ${interaction.user.tag} issued bot command '${interaction.commandName}'`);
            command.execute(interaction, client);
        }

        // Button interactions
        if (interaction.isButton()) {
            const { guild, member, customId, channel } = interaction;
            const { ViewChannel, SendMessages, ManageChannels, ReadMessageHistory } = PermissionFlagsBits;
            const ticketId = Math.floor(Math.random() * 10000);

            try {
                // Ticket panel
                if (customId == "openTicket") {
                    const channel = await interaction.guild.channels.create({
                        name: `ticket-${interaction.user.tag}`,
                        type: ChannelType.GuildText,
                        parent: '1100864752697233439'
                    });
        
                    channel.permissionOverwrites.create(interaction.user.id, { ViewChannel: true, SendMessages: true });
                    channel.permissionOverwrites.create(channel.guild.roles.everyone, { ViewChannel: false, SendMessages: false });
        
                    const welcomeEmbed = new EmbedBuilder()
                    .setColor(0x5865F2)
                    .setTitle("Support Channel")
                    .setDescription("You opened this support ticket. Please explain your issue and wait for a staff member to reply.");
        
                    Logger.Info(`[TICKETS] A new ticket has been created by ${interaction.user.tag}`);
        
                    channel.send({ content: `${interaction.user},`, embeds: [welcomeEmbed] });
                    interaction.reply({ content: `Your ticket has been successfully created in **${channel}**`, ephemeral: true });
                }
                // Verification panel
                else if (customId == "verifyButton")
                {
                    const role = interaction.guild.roles.cache.find(role => role.id == "");
                    if (!role) {
                        const errorEmbed = new EmbedBuilder()
                        .setTitle("Verification not available")
                        .setDescription("Member verification is disabled in this server.")
                        .setColor(0xf21b07);
            
                        await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
                        return;
                    }
            
                    const member = interaction.member;
            
                    if (member.roles.cache.has(role.id)) {
                        const errorEmbed = new EmbedBuilder()
                        .setTitle("Verification not available")
                        .setDescription("You are already verified within this server!")
                        .setColor(0xf21b07);
            
                        await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
                        return;
                    }
            
                    member.roles.add(role);
            
                    const verifiedEmbed = new EmbedBuilder()
                    .setTitle("Verified")
                    .setDescription("You are now verified within this server!")
                    .setColor(0x32a852);
            
                    await interaction.reply({ embeds: [verifiedEmbed], ephemeral: true });
                }
            }
            catch (err) {
                return Logger.Error("[ERR] An error occured while performing a button interaction: " + err);
            }
        }
    }
}