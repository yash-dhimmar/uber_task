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
        type: Sequelize.DATE,
        allowNull: false
      },
      driver_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Users',
          },
          key: 'user_id',
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Users',
          },
          key: 'user_id',
        },
      },
      start_latitude: {
        type: Sequelize.DOUBLE
      },
      start_longtitude: {
        type: Sequelize.DOUBLE
      },
      start_point: {
        type: Sequelize.DOUBLE
      },
      end_latitude: {
        type: Sequelize.DOUBLE
      },
      end_longtitude: {
        type: Sequelize.DOUBLE
      },
      end_point: {
        type: Sequelize.DOUBLE
      },
      tripfare: {
        type: Sequelize.DOUBLE
      },
      farecollected: {
        type: Sequelize.BOOLEAN
      },
      start_time: {
        type: Sequelize.TIME
      },
      end_time: {
        type: Sequelize.TIME
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