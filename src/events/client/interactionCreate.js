const moment                                                = require('moment');
const { inverse, green }                                    = require('chalk');
const { EmbedBuilder, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { CHANNEL_LOG_COMMANDS }                              = require('../../../config.json');

module.exports = {
    name: 'interactionCreate',
    execute: async(interaction) => {
        let hours = moment(interaction.createdAt).format('HH');
        let minuts = moment(interaction.createdAt).format('mm');
        console.log(green(`Une interaction a été effectuée par ${interaction.user.username} dans ${interaction.channel.name}`));
        console.log(green(`Infos de l'interaction : commande ${inverse(`/${interaction.commandName}`)} à ${inverse(`${hours}h${minuts}`)}\n-------------`));
        
        const embed = new EmbedBuilder()
            .setAuthor({
                name: interaction.user.username, 
                iconURL: interaction.user.avatarURL()
            })
            .setTitle(`Interaction effectuée par : ${interaction.user.tag}`)
            .setDescription(`Commande : ${interaction.commandName}\nSalon : <#${interaction.channel.id}>`)
            .setTimestamp()
            .setColor('#66ffcc')

        /*if (interaction.isButton()) {
            console.log(`Le boutton ${interaction.customId} a été sélectionné`)

            if (interaction.customId === 'get_id') {
                var test = require('../../commands/misc/userinfo.js');
                interaction.reply({ content: `${test.Id}`, ephemeral: true});
            }
        }**/

        if (interaction.isSelectMenu()) {
            console.log(`Le menu ${interaction.customId} a été sélectionné`);
            await interaction.deferUpdate();

            if (interaction.customId === 'menuHelp') {
                if (interaction.values[0] === "misc") {
                    const embed = new MessageEmbed()
                        .setAuthor(`${interaction.client.user.username}`, interaction.client.user.avatarURL())
                        .setTitle("Liste des commandes générales pour l'asso")
                        .addFields(
                            {name: '`/chess`', value: `indique ta présence`, inline: true},
                            {name: '`/register`', value: `permet de t'inscrire auprès du bot`, inline: true},
                            {name: '`/profile`', value: `profil de la personne`, inline: true},
                            {name: '`/myPoints`', value: `Nombre de points que tu as actuellement`, inline: true},
                            {name: '`/club`', value: `Infos à propos du club Chess`, inline: true}
                        )
                        .setColor("#4ac26a")
                        .setFooter('Commandes du bot')
                        .setTimestamp()

                    interaction.editReply({ embeds: [embed]});
                } 

                if (interaction.values[0] === "staff") {
                    const embed = new MessageEmbed()
                        .setAuthor(`${interaction.client.user.username}`, interaction.client.user.avatarURL())
                        .setTitle('Liste des commandes de modération')
                        /*.addFields(
                            {name: '`/kick`', value: `expulse le gars`, inline: true},
                            {name: '`/ban`', value: `bannit le mec`, inline: true},
                            {name: '`/clear`', value: `supprime le nombre de messages inséré`, inline: true}
                        )*/
                        .addFields({name: "//", value: "Pas dispo", inline: true})
                        .setColor("#4ac26a")
                        .setFooter('Commandes du bot')
                        .setTimestamp()

                interaction.editReply({ embeds: [embed]});
                }
            }
        }

        const channel = interaction.guild.channels.cache.get(CHANNEL_LOG_COMMANDS);
        if (channel) channel.send({ embeds: [embed] });
        else console.log("Channel de logs introuvable");
    }
}