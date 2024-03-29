const { SlashCommandBuilder }     = require('@discordjs/builders');
const moment                      = require('moment');
const XLSX                        = require('xlsx');
const User                        = require('../../models/User');
const ADMIN_ROLE                  = require("../../../config.json").ADMIN_ROLE;
const RAPPORTS_FOLDER             = require("../../../config.json").RAPPORTS_FOLDER;
const fs                          = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('excel')
        .setDescription('Commande staff'),
    async execute(interaction) {
        if (interaction.member.roles.cache.has(ADMIN_ROLE)) {
            moment.locale('FR');
            const date = moment().format('D_MM');
            fs.open(RAPPORTS_FOLDER+`/rapport_${date}.xlsx`, "w", () => {});
            const file = XLSX.readFile(RAPPORTS_FOLDER+`/rapport_${date}.xlsx`);
            let data = [];

            const users = await User.findAll();

            users.forEach((user) => {
                let tmp = {
                    Nom: user.name + " " + user.lastname,
                    Points: user.current_points,
                    Classe: user.class_tag
                };
                data.push(tmp);
            });

            const ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(file, ws, `Rapport ${date}`);
            XLSX.writeFile(file, RAPPORTS_FOLDER+`/rapport_${date}.xlsx`);

            await interaction.reply({
                content: `Salut ${interaction.user.username}, le fichier a été généré, le voici !`,
                files: [RAPPORTS_FOLDER+`/rapport_${date}.xlsx`],
                ephemeral: true
            });
        } else {
            return interaction.reply({ content: `Tu n'as pas la permission`, ephemeral: true});
        }
    } 
}