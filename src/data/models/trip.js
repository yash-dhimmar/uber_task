'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Trip.init({
    trip_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    tripDate: {
      type: DataTypes.DATE,
      allowNull: false
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
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'Users',
        },
        key: 'user_id',
      },
    },
    tripStatus: {
      type: DataTypes.ENUM('Customer Requested', 'Driver Rejected', 'Driver Accepted', 'Trip Started', 'Trip Completed'),
      defaultValue: 'Customer Requested'
    },
    pickuplocation_id: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'pickuplocations',
        },
        key: 'pickuplocation_id',
      },
    },
    pickupdistance: DataTypes.DOUBLE,
    estimatepickuptime: DataTypes.DOUBLE,
    droplocation_id: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'droplocations',
        },
        key: 'droplocation_id',
      },
    },
    estimatedroplocationtime: DataTypes.DOUBLE,
    tripfare: DataTypes.DOUBLE,
    farecollected: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Trip',
  });
  return Trip;
};