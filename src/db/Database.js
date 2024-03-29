const { Sequelize } = require('sequelize');
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const databaseSequelize = new Sequelize(dbName, dbUser, dbPassword, {
   host: process.env.DB_HOST,
   dialect: "mariadb"
});

async function connectToDatabase() {
   try {
      await databaseSequelize.authenticate();
      console.log('Database connection success !');
   } catch (error) {
      console.error('Error during connecting to the database :', error);
   }
}

module.exports = databaseSequelize;