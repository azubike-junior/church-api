'use strict';

module.exports = (sequelize, DataTypes) => {
  const commentSchema = {
      comment_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            unique: true
        },
      content: {
        type: DataTypes.STRING
      },
      created_at: {
        type: DataTypes.DATE
      },
      post_id: {
        type: DataTypes.STRING
      },
      reviewer_id: {
        type: DataTypes.STRING
      },
    }
    
    const comment = sequelize.define('Comment', commentSchema, {},)

    comment.associate = db => {
      comment.belongsTo(db.Post, {
        foreignKey: 'post_id',
        sourceKey:'post_id'
      })
      comment.belongsTo(db.User, {
        foreignKey: 'user_id',
        sourceKey:'reviewer_id'
      })
    }

    comment.prototype.updateComment = function (content) {
    this.content = content;
    this.save();
    return this

    }
    
  return comment;
};