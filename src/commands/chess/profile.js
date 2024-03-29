const { SlashCommandBuilder, ButtonBuilder }    = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder }        = require('discord.js');
const moment                                    = require('moment');
const ChessWebAPI                               = require('chess-web-api');

module.exports = {
   data: new SlashCommandBuilder()
      .setName('profile')
      .setDescription(`Profil chess de la personne`)
      .addStringOption(option =>
         option.setName('nom_utilisateur')
            .setDescription('Utilisateur chess (indique le pseudo chess pas discord) dont tu veux voir le profil')
            .setRequired(true)
      ),
   async execute(interaction) {
      const chessAPI = new ChessWebAPI();
      const chessUserSearch = interaction.options.getString('nom_utilisateur');

      try {
         let user = await chessAPI.getPlayer(chessUserSearch);
         if (user && user.body) user = user.body;
         const playerStats = await chessAPI.getPlayerStats(chessUserSearch);

         moment.locale("fr");
         var numberOfGames = 0;
         var userStats = playerStats.body;

         var isPremium = (user.status === 'premium') ? "Prenium 💎" : "Standart 👤";
         var userAvatar = (user.avatar !== undefined) ? user.avatar :
            "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SuperMember/phpLDm0ec.png";

         let gameType = [
            userStats.chess_rapid,
            userStats.chess_blitz,
            userStats.chess_bullet
         ];

         for (let i = 0; i < gameType.length; i++) {
            if (gameType[i] != undefined) {
               numberOfGames += gameType[i].record.win;
               numberOfGames += gameType[i].record.loss;
               numberOfGames += gameType[i].record.draw;
            } else {
               numberOfGames = numberOfGames + 0;
            }
         }

         puzzleStats = (userStats.puzzle_rush !== undefined) ? userStats.puzzle_rush.best.score : "Pas de puzzle";
         const userJoinedChessAt = moment.unix(user.joined).format("DD/MM/YYYY");

         const embed = new EmbedBuilder()
            .setAuthor({
               name: `${user.username}`,
               iconURL: userAvatar
            })
            .setColor('#2fad39')
            .addFields(
               { name: 'ID Profil', value: `${user.player_id}`, inline: false },
               { name: 'Followers', value: `${user.followers}`, inline: true },
               { name: 'Statut', value: `${isPremium}`, inline: true },
               { name: "Date d'inscription", value: `${userJoinedChessAt}`, inline: true },
               { name: 'Nb total games', value: `${numberOfGames}`, inline: true },
               { name: 'Elo Rapid', value: `${userStats.chess_rapid.last.rating}`, inline: true },
               { name: 'Nb gagnées Rapid', value: `${userStats.chess_rapid.record.win}`, inline: true },
               { name: 'Nb perdues Rapid', value: `${userStats.chess_rapid.record.loss}`, inline: true },
               { name: 'Matchs nuls Rapid', value: `${userStats.chess_rapid.record.draw}`, inline: true },
               { name: 'Elo Bullet', value: `${userStats.chess_bullet.last.rating}`, inline: true },
               { name: 'Elo Blitz', value: `${userStats.chess_blitz.last.rating}`, inline: true },
               { name: 'Meilleur score Puzzle', value: `${userStats.tactics.highest.rating}`, inline: true },
               { name: 'Score Puzzle Rush', value: `${puzzleStats}`, inline: true },
            )
            .setTimestamp()
            .setThumbnail(userAvatar)
            .setFooter({ text: 'Association échecs' });

         const button = new ActionRowBuilder()
            .addComponents(
               new ButtonBuilder()
                  .setStyle("Link")
                  .setLabel("Lien Profil")
                  .setURL(`${user.url}`),
            );

         return interaction.reply({ embeds: [embed], components: [button], ephemeral: false });
      } catch (error) {
         console.log("Error at chessProfile : ", error);
         return interaction.reply({ content: "Je n'ai pas trouvé cet utilisateur.", ephemeral: true });
      }
   }
}