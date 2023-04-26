const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle, ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "ticketpanel",
    description: "Create a new ticket panel in the current channel.",
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    execute: async (interaction, client) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
            return await interaction.reply({ content: "You don't have the permission to use this command.", ephemeral: true });

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('button')
            .setLabel('Create a Ticket')
            .setStyle(ButtonStyle.Primary),
        )

        const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle("Open a Ticket")
        .setDescription("If you need support or you need to talk to the staff, click the button below to open a ticket.");

        await interaction.reply({ embeds: [embed], components: [button] });

        const collector = await interaction.channel.createMessageComponentCollector();

        collector.on('collect', async i =>
        {
            await i.update({ embeds: [embed], components: [button] });

            const channel = await interaction.guild.channels.create({
                name: `ticket-${i.user.tag.toLowerCase()}`,
                type: ChannelType.GuildText,
                parent: '1100864752697233439'
            });

            channel.permissionOverwrites.create(i.user.id, { ViewChannel: true, SendMessages: true });
            channel.permissionOverwrites.create(channel.guild.roles.everyone, { ViewChannel: false, SendMessages: false });

            const welcomeEmbed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle("Support Channel")
            .setDescription("You opened this support ticket. Please explain your issue and wait for a staff member to reply.");

            channel.send({ content: `${i.user},`, embeds: [welcomeEmbed] });
            i.user.send(`Your ticket in **${i.guild.name}** has been successfully created in **${i.channel}**`);
        })
    }
}