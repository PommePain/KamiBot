const { SlashCommandBuilder }   = require('@discordjs/builders');
const User                      = require("../../models/User");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delmember')
        .setDescription("Supprimer un membre")
        .addUserOption(option =>
            option.setName('username')
                .setDescription("l'utilisateur")
                .setRequired(true)
        ),
    async execute(interaction) {
        // Check if member is a staff of the server
        if (interaction.member.permissions.has("MANAGE_GUILD")) {
            var discordUser = interaction.options.getUser("username");
            const user = await User.findOne({ where: { discord_id: discordUser.id }});

            if (user !== null) {
                await user.destroy();   // Delete the user from the database
                await interaction.reply({ content: `J'ai bien supprimé ${user.tag}`, ephemeral: false });
            } else {
                await interaction.reply({ content: `${discordUser.username} n'est pas inscrit`, ephemeral: false });
            }
        } else {
            console.log(`${interaction.user.username} a essayé de faire /delmember mais il n'a pas le droit`);
            return interaction.reply({ content: `Tu n'as pas la permission`, ephemeral: true});
        }
    } 
}