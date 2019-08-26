'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('articles', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    body: DataTypes.TEXT,
    image: DataTypes.TEXT
  }, {});
  Article.associate = function(models) {
    // associations can be defined here
  };
  return Article;
};