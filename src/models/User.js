const { Sequelize, DataTypes }   = require('sequelize');
const databaseSequelize          = require('../db/Database');
const Presence                   = require('./Presence');

const User = databaseSequelize.define('User', {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },
   discord_username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
   },
   name: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true
   },
   lastname: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true
   },
   chess_username: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true
   },
   class_tag: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true
   },
   discord_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
   },
   current_points: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
   }
}, {
   tableName: "users"
});

User.hasMany(Presence);

module.exports = User;