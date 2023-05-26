'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    user_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
  
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    mobilenumber: DataTypes.INTEGER,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    type: DataTypes.INTEGER,
    auth_token: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  });
  return User;
};