const { SlashCommandBuilder }   = require('@discordjs/builders');
const User                      = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mypoints')
        .setDescription("Voit le profil d'association"),
    async execute(interaction) {
        try {
            var discordUser = interaction.user;
            const user = await User.findOne({ where: { discord_id: discordUser.id }});
    
            if (user !== null) {
                await interaction.reply({ 
                    content: `Salut ${user.discord_username}, tu as ${user.current_points} points.`, 
                    ephemeral: false 
                });
            } else {
                await interaction.reply({ content: `${discordUser.username} n'est pas inscrit`, ephemeral: false });
            }
        } catch (error) {
            console.log("Error at myPoint execution : ", error);
        }
    } 
}