'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Trips', {
      trip_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        type: Sequelize.ENUM('Customer Requested', 'Driver Rejected', 'Driver Accepted', 'Trip Started', 'Trip Completed'),
        defaultValue: 'Customer Requested'
      },
      pickuplocation_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'pickuplocations',
          },
          key: 'pickuplocation_id',
        },
      },
      pickupdistance: {
        type: Sequelize.DOUBLE
      },
      estimatepickuptime: {
        type: Sequelize.DOUBLE
      },
      droplocation_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'droplocations',
          },
          key: 'droplocation_id',
        },
      },
      estimatedroplocationtime: {
        type: Sequelize.DOUBLE
      },
      tripfare: {
        type: Sequelize.DOUBLE
      },
      farecollected: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Trips');
  }
};