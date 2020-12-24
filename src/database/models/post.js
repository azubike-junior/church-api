'use strict';

module.exports = (sequelize, DataTypes) => {
  const postSchema = {
      post_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            unique: true
        },
      content: {
        type: DataTypes.STRING
      },
      created_at: DataTypes.DATE,
      description: {
        type: DataTypes.STRING
      },
      author_id: {
        type: DataTypes.UUID
      },
      numberOfComments: {
        type: DataTypes.INTEGER
      },
    }
    
    const post = sequelize.define('Post', postSchema, {timestamps: false},)

    post.associate = db => {
      post.hasMany(db.Comment, {
         foreignKey: 'post_id'
      })
      post.belongsTo(db.User, {
        foreignKey: 'author_id',
        sourceKey:'user_id'
      })
    }
  
  post.prototype.updatePost = function (content, description) {
    this.content = content;
    this.description = description;
    this.save();
    return this;
    }
    
  return post;
};