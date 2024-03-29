const fs                        = require('fs');
//const { red, white, bgWhite }   = require('chalk');

module.exports = (client) => {
    fs.readdirSync(`./commands/`).forEach((dir) => {
        const commandFiles = fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));
    
        for (const file of commandFiles) {
            const command = require(`../commands/${dir}/${file}`);
            client.commands.set(command.data.name, command);
            //console.log(red(`Commande chargée ${white(':')} ${bgWhite(`${command.data.name} / [${dir}]`)}`));
        }
    })
}