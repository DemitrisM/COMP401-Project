'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here later (e.g., User.hasMany(Order))
    }
  }

  User.init(
    {
      username:      DataTypes.STRING,
      email:         DataTypes.STRING,
      passwordHash:  DataTypes.STRING,
      role: {
        type: DataTypes.ENUM('CUSTOMER', 'ADMIN'),   // <-- fixed
        allowNull: false,
        defaultValue: 'CUSTOMER'
      }
    },
    {
      sequelize,
      modelName: 'User'
    }
  );

  return User;
};
