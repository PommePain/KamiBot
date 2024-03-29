const fs            = require('fs');
const { magenta }   = require('chalk');

module.exports = (client) => {
    console.log('-----------\n'+magenta('Chargement des events'));
    fs.readdirSync(`./events/`).forEach((dir) => {
        const eventFiles = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            // Load each event file of the folder
            const event = require(`../events/${dir}/${file}`);
    
            if (event.once) client.once(event.name, (...args) => event.execute(...args));
            else client.on(event.name, (...args) => event.execute(...args));
        
            console.log(magenta(`Event chargé : ${event.name}`));
        }
    })
}