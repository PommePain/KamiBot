require('dotenv').config();

const { TOKEN }                                             = require('../config.json');
const { Client, Intents, GatewayIntentBits, Collection }    = require('discord.js');
const databaseSequelize                                     = require("./db/Database");
const User                                                  = require('./models/User');
const Presence                                              = require('./models/Presence');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        /*Intents.FLAGS.GUILDS,
        Intents.FLAG.GUILDS_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS_GUILD_PRESENCES,
        Intents.FLAGS_GUILD_VOICE_STATES,
        Intents.FLAGS_GUILD_MESSAGES_REACTIONS,
        Intents.FLAGS_INVITES,
        Intents.FLAGS_GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS_DIRECT_MESSAGES,*/
    ]
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = require('fs').readdirSync('./commands');
client.events = require('fs').readdirSync('./events');
['commands', 'events', 'slash_commands'].forEach(util => { require(`./utils/${util}`)(client) });

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    try {
        await databaseSequelize.authenticate();
        console.log('Connexion à la base de données réussie !');
    } catch (error) {
        console.error('Impossible de se connecter à la base de données :', error);
    }

    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;

    try {
        await cmd.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "Erreur durant l'exécution de la commande", ephemeral: true });
    }
});

async function syncDb () {   
    try {
        await User.sync();
        await Presence.sync({ alter: true });
    } catch (error) {
        console.log("Error sync db : ", error);
    }
}

syncDb();

client.login(TOKEN);