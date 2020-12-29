'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Users',
        'isVerified',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
      ),
      queryInterface.addColumn(
        'Users',
        'resetToken',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      )
    ]);

  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
          queryInterface.removeColumn('Users', 'isVerified'),
          queryInterface.removeColumn('Users', 'resetToken'),
        ]);
      }
};
