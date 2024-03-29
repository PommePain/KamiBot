const { blue, cyan }    = require('chalk');
const { ActivityType }  = require('discord.js');
const { STATUS }        = require('../../../config.json');

module.exports = (interaction) = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Connecté : ${blue(client.user.tag)} | ID : ${cyan(client.user.id)}`);
        client.user.setActivity(STATUS, { type: ActivityType.Watching });
    }
};