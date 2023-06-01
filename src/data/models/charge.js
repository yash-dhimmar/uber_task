'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Charge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Charge.init({
    stripe_charges_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'Users',
        },
        key: 'user_id',
      },
    },
    charge_id: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    date: DataTypes.DATE,
    currency: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Charge',
  });
  return Charge;
};