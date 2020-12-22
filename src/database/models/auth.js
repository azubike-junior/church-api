'use strict';
import {hashPassword, comparePassword} from '../../api/utils/password'

module.exports = (sequelize, DataTypes) => {
  const authSchema = {
      auth_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement:true,
            unique: true
        },
      password: {
        type: DataTypes.STRING
      },
      user_id: {
        type: DataTypes.UUID
      },
    }
    
  const auth = sequelize.define('Auth', authSchema, {
    timestamps: false,
    hooks: {
      beforeCreate: auth => {
        auth.password = hashPassword(auth.password);
          return auth.password
        }
      }
  })
  
  auth.associate = db => {
    auth.belongsTo(db.User, {
      foreignKey: 'user_id',
      sourceKey: 'user_id'
    })
  }

  auth.prototype.comparePassword = function (password) {
    return comparePassword(password, this.password)
  }

  return auth;
};