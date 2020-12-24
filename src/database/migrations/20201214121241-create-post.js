'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Posts', {
      post_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: Sequelize.DATE,
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      author_id: {
        type: Sequelize.STRING
      },
      numberOfComments: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Post');
  }
};