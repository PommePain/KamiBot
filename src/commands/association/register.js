const { SlashCommandBuilder }               = require('@discordjs/builders');
const { EmbedBuilder, resolveColor }        = require('discord.js');
const { REGISTER_CHANNEL }                  = require('../../../config.json');
const User                                  = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Inscrit toi dans la liste des membres')
        .addStringOption(option =>
            option.setName('prenom_nom')
                .setDescription('prénom nom (sans le tiret du bas) + 30 caractères maximum')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('classe')
                .setDescription('ta classe')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('pseudo_chess')
                .setDescription('Ton pseudo chess (Si tu as un compte)')
                .setRequired(false)
        ),
    async execute(interaction) {
        const channel         = interaction.guild.channels.cache.get(REGISTER_CHANNEL);
        var nameLastname      = interaction.options.getString("prenom_nom");
        var classe            = interaction.options.getString("classe");
        var chessUsername     = interaction.options.getString("pseudo_chess");
        var user              = interaction.user;

        if (nameLastname.length > 30) return interaction.reply({
            content: '30 caractères maximum pour le prénom/nom',
            ephemeral: true
        })

        if (interaction.options.getString("pseudo_chess") == null) chessUsername = "Non renseigné";

        const embed = new EmbedBuilder()
            .setTitle(`${user.tag} s'est inscrit.`)
            .setThumbnail(user.avatarURL())
            .addFields(
                { name: 'Nom', value: `${nameLastname}`, inline: true},
                { name: 'Classe', value: `${classe}`, inline: true},
                { name: 'ID', value: `${user.id}`, inline: false},
                { name: 'Pseudo chess', value: `${chessUsername}`, inline: false},
            )
            .setColor('#3f9155')
            .setFooter({
                text: "Inscription à l'association"
            })
            .setTimestamp();

        const checkUser = await User.findOne({ where: { discord_id: user.id } });

        if (checkUser !== null) {
            return interaction.reply({ content: `${user.username}, tu es déjà inscrit.`, ephemeral: true });
        } else {
            //var role        = interaction.guild.roles.cache.get('1032287262282612828');
            //var removedRole = interaction.guild.roles.cache.get('1032287231097966603');

            const newUser = await User.create({
                discord_username: user.username,
                discord_id: user.id,
                name: nameLastname.split(" ")[0],
                lastname: nameLastname.split(" ")[1],
                class_tag: classe,
                current_points: 0
            });

            console.log(`User ${user.username} has registered, ID => ${newUser.id}`);

            //interaction.member.roles.add(role, 'Inscription association');
            //interaction.member.roles.remove(removedRole, `Rôle retiré par ${interaction.user.username}`);
            
            await interaction.reply({ content: `Salut ${user}, ton inscription a bien été faite.`, ephemeral: true});
            channel.send({ embeds: [embed]});
        }
    }
}