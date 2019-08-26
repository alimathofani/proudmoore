'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    name: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    phone_number: DataTypes.STRING,
    gender: DataTypes.BOOLEAN
  }, {});
  
  User.associate = function(models) {
    // associations can be defined here
  };

  User.beforeCreate((user, options) => {
    user.password = bcrypt.hashSync(user.password, saltRounds);
  });

  return User;
};