const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Renvoie la latence du bot (avec l'api) !"),
    async execute(interaction) {
        let first = await interaction.reply({ content: 'Ping en cours', fetchReply: true, ephemeral: true});
        interaction.editReply({ content:`Latence : ${first.createdTimestamp - interaction.createdTimestamp} MS`});
    }
}