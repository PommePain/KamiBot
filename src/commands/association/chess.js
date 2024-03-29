const { SlashCommandBuilder }                   = require('@discordjs/builders');
const { EmbedBuilder }                          = require('discord.js');
const { PRESENCE_CHANNEL, REGISTER_CHANNEL }    = require('../../../config.json');
const User                                      = require("../../models/User");
const Presence                                  = require("../../models/Presence");
const moment                                    = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chess')
        .setDescription('Indique que tu es présent'),
    async execute(interaction) {
        const channel = interaction.guild.channels.cache.get(PRESENCE_CHANNEL);
        const registerChannel = interaction.guild.channels.cache.get(REGISTER_CHANNEL);
        const discordUser = interaction.user;

        const user = await User.findOne({ where: { discord_id: discordUser.id }});
        let currentDate = moment().format("YYYY-MM-D").split(" ")[0];
        currentDate += " 00:00:00";
        
        if (user !== null) {
            console.log(currentDate);
            const checkPresence = await Presence.findOne({ where: { user_id: user.id, date: currentDate }});

            if (checkPresence === null) {
                const presence = await Presence.create({
                    user_id: user.id,
                    date: currentDate
                });
                await presence.save();
                user.current_points += 1;
                await user.save();

                const embed = new EmbedBuilder()
                .setAuthor({
                    name: user.discord_username, 
                    iconURL: discordUser.avatarURL()
                })
                .setDescription(`${user.discord_username} a indiqué sa présence.\nAjout d'un point`)
                .setColor('#4ac26a')
                .setFooter({
                    text: "Association échecs"
                })
                .setTimestamp();

                await interaction.reply({ content: `Salut ${user.discord_username}, j'ai bien pris en compte ta présence.`, ephemeral: false});
                channel.send({ embeds: [embed]});
            } else {
                return interaction.reply({ content: `Salut ${user.discord_username}, tu a déjà signé pour aujourd'hui.`, ephemeral: false});
            }
        } else {
            await interaction.reply({ 
                content: `${discordUser.username}, tu n'es pas inscrit, viens t'inscrire en faisant /register dans ${registerChannel}.`, 
                ephemeral: true
            });
        }
    } 
}