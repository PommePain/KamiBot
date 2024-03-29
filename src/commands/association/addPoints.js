const { SlashCommandBuilder }   = require('@discordjs/builders');
const User                      = require("../../models/User");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addpoints')
        .setDescription("Ajouter des points à un membre")
        .addUserOption(option =>
            option.setName('username')
                .setDescription("l'utilisateur")
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName('nb_points')
                .setDescription("Nombres de points")
                .setRequired(true)
        ),
    async execute(interaction) {
        if (interaction.member.permissions.has("MANAGE_GUILD")) {
            const discordUser = interaction.options.getUser("username");
            const amount = interaction.options.getNumber("nb_points");
            const user = await User.findOne({ where: { discord_id: discordUser.id }});

            if (user !== null) {
                user.current_points = amount;
                await user.save();
                await interaction.reply({ content: `J'ai bien ajouté ${amount} points à ${user.discord_username}`, ephemeral: false });
            } else {
                await interaction.reply({ content: `${discordUser.username} n'est pas inscrit`, ephemeral: false });
            }
        } else {
            return interaction.reply({ content: `Tu n'as pas la permission`, ephemeral: true});
        }
    } 
}