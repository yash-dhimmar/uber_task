'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class driver_availability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  driver_availability.init({
    driver_availibility_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    driver_id: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'users',
        },
        key: 'user_id',
      },
    },
    day: {
      type: DataTypes.INTEGER
    },
    start_time: {
      type: DataTypes.TIME
    },
    end_time: {
      type: DataTypes.TIME
    },
    flag: {
      type: DataTypes.SMALLINT
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Driver_availability',
    tableName:'driver_availabilities'
  });
  return driver_availability;
};