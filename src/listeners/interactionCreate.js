const Logger = require("../Logger");
const { CommandInteraction, PermissionFlagsBits, ChannelType, ButtonStyle, TextChannel, TextInputStyle } = require('discord.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder } = require('@discordjs/builders');

const ticketSupportRole = '1099340524818800660';

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client)
    {
        // Slash commands
        if (interaction.isChatInputCommand())
        {
            const command = client.commands.get(interaction.commandName);
            if (!command)
                return interaction.reply({ content: `Invalid command: ${interaction.commandName}`, ephemeral: true });

            Logger.Info(`[INFO] ${interaction.user.tag} issued bot command '${interaction.commandName}'`);
            command.execute(interaction, client);
        }

        // Button interactions
        if (interaction.isButton()) {
            const { customId } = interaction;
            try {
                // Ticket panel - Create a ticket
                if (customId == "openTicket")
                {
                    const channel = await interaction.guild.channels.create({
                        name: `ticket-${interaction.user.tag}`,
                        type: ChannelType.GuildText,
                        parent: '1100864752697233439'
                    });
        
                    channel.permissionOverwrites.create(interaction.user.id, { ViewChannel: true, SendMessages: true });
                    channel.permissionOverwrites.create(channel.guild.roles.cache.find(r => r.id == ticketSupportRole), { ViewChannel: true, SendMessages: true });
                    channel.permissionOverwrites.create(channel.guild.roles.everyone, { ViewChannel: false, SendMessages: false });
        
                    const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('closeTicket')
                        .setLabel('Close ticket')
                        .setStyle(ButtonStyle.Secondary),
                    )

                    const welcomeEmbed = new EmbedBuilder()
                    .setColor(0x5865F2)
                    .setTitle("Support Channel")
                    .setDescription("You opened this support ticket. Please explain your issue and wait for a staff member to reply.");
        
                    Logger.Info(`[TICKETS] A new ticket has been created by ${interaction.user.tag}`);
        
                    channel.send({ content: `${interaction.user},`, embeds: [welcomeEmbed], components: [button] });
                    interaction.reply({ content: `Your ticket has been successfully created in **${channel}**`, ephemeral: true });
                }
                // Ticket panel - Close a ticket
                else if (customId == "closeTicket")
                {
                    const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('closeTicketConfirm')
                        .setLabel('Close ticket')
                        .setStyle(ButtonStyle.Danger),
                    )
            
                    const embed = new EmbedBuilder()
                    .setColor(0x5865F2)
                    .setTitle("Confirmation")
                    .setDescription("Please confirm that you want to close this ticket.");
            
                    interaction.reply({ embeds: [embed], components: [button] });
                }
                // Ticket panel - Close a ticket (confirm)
                else if (customId == "closeTicketConfirm")
                {
                    const reasonModal = new ModalBuilder()
                    .setTitle("Close Ticket")
                    .setCustomId("closeTicketReason")
                    .setComponents(
                        new ActionRowBuilder().setComponents(
                            new TextInputBuilder()
                            .setLabel("Reason")
                            .setCustomId("reason")
                            .setPlaceholder("Why are you closing this ticket?")
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                            .setMaxLength(200)
                        )
                    )

                    interaction.showModal(reasonModal);
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

        // Modals
        if (interaction.isModalSubmit()) {
            const { customId } = interaction;
            try {
                // Closing a ticket (getting reason via modal)
                if (customId == "closeTicketReason") {
                    const reason = interaction.fields.getTextInputValue("reason");
                    const closeEmbed = new EmbedBuilder()
                    .setColor(0x5865F2)
                    .setTitle("Ticket closed")
                    .addFields(
                        { name: "Ticket name", value: `\`${interaction.channel.name}\``, inline: true },
                        { name: "Closed by", value: `\`${interaction.user.tag}\``, inline: true },
                        { name: "Reason", value: `\`\`\`\n${reason}\`\`\``, inline: false }
                    )
                    .setTimestamp();

                    await interaction.guild.channels.cache.get("1103002360910971081").send({ embeds: [closeEmbed] });
                    await interaction.channel.delete();
                    await interaction.reply({ content: 'The ticket has been successfully closed.' })
                }
            }
            catch (err) {
                return Logger.Error("[ERR] An error occured while handling a modal: " + err);
            }
        }
    }
}