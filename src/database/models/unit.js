'use strict';

module.exports =  (sequelize, DataTypes) => {
  const unitSchema = {
      unit_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: true,
            autoIncrement: true,
            unique: true
        },
      name: {
        type: DataTypes.STRING
      },
      numberOfPeople: {
        type: DataTypes.INTEGER
      },
    }
    
    const unit = sequelize.define('Unit', unitSchema, {timestamps: false},)

    unit.associate = db => {
      unit.hasMany(db.User, {
        foreignKey: {
          name: 'unit',
          allowNull: true
        },
        sourceKey:'unit_id'
       })
    }
    
  return unit;
};