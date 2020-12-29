'use strict';
import { decryptToken, getTimeDifference } from '../../api/utils/crypto';
import { hashPassword, comparePassword } from '../../api/utils/password'
import config from '../../config/config'

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

  auth.prototype.resetPassword = async function (token, password) {
        if (getTimeDifference(decryptToken(token)) > Number(config.tokenExpiry)) {
            throw new Error("The Link has expired");
        }
        this.password = hashPassword(password);
        this.save();
    };

  return auth;
};