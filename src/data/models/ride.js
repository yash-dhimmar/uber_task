'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ride extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ride.init({
    ride_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    driver_id: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'Users',
        },
        key: 'user_id',
      },
    },
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME,
    trip_status_type: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ride',
    tableName: 'rides'
  });
  return Ride;
};