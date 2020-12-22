'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Units', {
      unit_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      numberOfPeople: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Unit');
  }
};