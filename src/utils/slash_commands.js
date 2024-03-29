const { red, bgWhite, bold, black }     = require('chalk');
const { REST }                          = require('@discordjs/rest');
const fs                                = require('fs');
const { Routes }                        = require('discord-api-types/v10');
const { CLIENT_ID, GUILD_ID, TOKEN }    = require('../../config.json');
const commands                          = [];

module.exports = (client) => {
    fs.readdirSync(`./commands/`).forEach((dir) => {
        const commandFiles = fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));
    
        for (const file of commandFiles) {
            const command = require(`../commands/${dir}/${file}`);
            commands.push(command.data.toJSON());
            console.log(bgWhite(bold(black(`Commande chargée : ${command.data.name} -> [${dir}]`))));
        }
    })

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
        .then(() => console.log(red(`Les commandes de l'application ont été chargées`)))
        .catch(console.error);
}