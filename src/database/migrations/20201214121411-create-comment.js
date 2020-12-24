'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comments', {
      comment_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      content: {
        type: Sequelize.STRING
      },
      created_at: {
        type: Sequelize.DATE
      },
      post_id: {
        type: Sequelize.UUID
      },
      reviewer_id: {
        type: Sequelize.STRING
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Comment');
  }
};