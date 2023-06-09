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
    start_latitude: {
      type: DataTypes.DOUBLE
    },
    start_longtitude: {
      type: DataTypes.DOUBLE
    },
    start_point: {
      type: DataTypes.DOUBLE
    },
    end_latitude: {
      type: DataTypes.DOUBLE
    },
    end_longtitude: {
      type: DataTypes.DOUBLE
    },
    end_point: {
      type: DataTypes.DOUBLE
    },
    tripfare: {
      type: DataTypes.DOUBLE
    },
    farecollected: {
      type: DataTypes.BOOLEAN
    },
    start_time: {
      type: DataTypes.TIME
    },
    end_time: {
      type: DataTypes.TIME
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
    modelName: 'Trip',
    tableName: 'trips'
  });
  return Trip;
};