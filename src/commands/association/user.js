const { SlashCommandBuilder }   = require('@discordjs/builders');
const { EmbedBuilder }          = require('discord.js');
const ADMIN_ROLE                = require("../../../config.json").ADMIN_ROLE;
const User                      = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription("Voit le profil d'association")
        .addUserOption(option =>
            option.setName('username')
                .setDescription("l'utilisateur")
                .setRequired(true)
        ),
    async execute(interaction) {
        if (interaction.member.roles.cache.has(ADMIN_ROLE)) {
            const discordUser = interaction.options.getUser("username");
            const user = await User.findOne({ where: { discord_id: discordUser.id }});

            if (user !== null) {
                const embed = new EmbedBuilder()
                    .setTitle(`Informations de ${user.discord_username}`)
                    .setThumbnail(discordUser.avatarURL())
                    .addFields(
                        { name: 'ID', value: `${user.discord_id}`, inline: false},
                        { name: 'Prénom & Nom', value: `${user.name} ${user.lastname}`, inline: true},
                        { name: 'Classe', value: `${user.class_tag}`, inline: true},
                        { name: 'Points', value: `${user.current_points}`, inline: true},
                        { name: 'Pseudo Chess', value: `${user.chess_username}`, inline: true}
                    )
                    .setColor('#3f9155')
                    .setFooter({ text: "Association Echecs" })
                    .setTimestamp();

                await interaction.reply({ embeds: [embed], ephemeral: false });
            } else {
                await interaction.reply({ content: `${discordUser.username} n'est pas inscrit`, ephemeral: false });
            }
        } else {
            return interaction.reply({ content: `Tu n'as pas la permission`, ephemeral: true});
        }
    } 
}