const { Sequelize, DataTypes }   = require('sequelize');
const databaseSequelize          = require('../db/Database');

const Presence = databaseSequelize.define('Presence', {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },
   user_id: {
      type: DataTypes.BIGINT,
      unique: false,
      allowNull: false
   },
   date: {
      type: DataTypes.DATE,
      unique: false,
      allowNull: true
   }
}, {
   tableName: "presences"
});

module.exports = Presence;