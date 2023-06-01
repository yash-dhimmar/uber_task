'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Add_card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Add_card.init({
    add_card_id: {
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
    user_stripe_id: {
      type: DataTypes.STRING
    },
    card_id: {
      type: DataTypes.STRING
    },
    card_Name: DataTypes.STRING,
    card_ExpYear: DataTypes.INTEGER,
    card_ExpMonth: DataTypes.INTEGER,
    card_Number: DataTypes.INTEGER,
    card_CVC: DataTypes.INTEGER,
    source: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Add_card',
  });
  return Add_card;
};