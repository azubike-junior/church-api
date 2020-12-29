'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
     Promise.all([
      queryInterface.addColumn(
        'Users',
        'resetToken',
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        'Users',
        'isVerified',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
      ),
    ]);

    await queryInterface.createTable('Users', {
      user_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      account_type: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.DATE
      },
      unit: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      worker: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      first_timer: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      bio: {
        type: Sequelize.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('User');
  }
};