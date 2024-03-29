const { red, blue } = require('chalk');

module.exports = (interaction) = {
    name: 'rateLimit',
    once: true,
    async execute(rateLmit) {
        console.log(`Rate Limit : `);
        console.log(`   Timeout : ${blue(rateLmit.timeout)}\n   Méthode : ${red(rateLmit.method)}`);
    }
};