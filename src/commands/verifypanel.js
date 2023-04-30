const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle, ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "verifypanel",
    description: "Create a new verification panel in the current channel.",
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
            .setLabel('Verify yourself')
            .setStyle(ButtonStyle.Success),
        )

        const embed = new EmbedBuilder()
        .setColor(0x32a852)
        .setTitle("Verifying")
        .setDescription("Click the button below to verify your account and access the server channels.");

        await interaction.reply({ embeds: [embed], components: [button] });

        const collector = await interaction.channel.createMessageComponentCollector();

        collector.on('collect', async i =>
        {
            const role = i.guild.roles.cache.find(role => role.id == "");
            if (!role) {
                const errorEmbed = new EmbedBuilder()
                .setTitle("Verification not available")
                .setDescription("Member verification is disabled in this server.")
                .setColor(0xf21b07);
    
                await i.reply({ embeds: [errorEmbed], ephemeral: true })
                return;
            }
    
            const member = i.member;
    
            if (member.roles.cache.has(role.id)) {
                const errorEmbed = new EmbedBuilder()
                .setTitle("Verification not available")
                .setDescription("You are already verified within this server!")
                .setColor(0xf21b07);
    
                await i.reply({ embeds: [errorEmbed], ephemeral: true })
                return;
            }
    
            member.roles.add(role);
    
            const verifiedEmbed = new EmbedBuilder()
            .setTitle("Verified")
            .setDescription("You are now verified within this server!")
            .setColor(0x32a852);
    
            await i.reply({ embeds: [verifiedEmbed], ephemeral: true });
        })
    }
}