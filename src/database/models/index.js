'use strict';

import fs from 'fs'
import path from "path";
import Sequelize from "sequelize";
import  config from '../../config/config.js'

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env]
console.log(dbConfig)
const configPath = env === 'development' ? dbConfig.url : dbConfig.url
const db = {};

let sequelize;
sequelize = env === 'development' ? new Sequelize(configPath) : new Sequelize(configPath)

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
