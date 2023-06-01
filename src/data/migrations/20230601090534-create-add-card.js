'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Add_cards', {
      add_card_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      user_stripe_id: {
        type: Sequelize.STRING
      },
      card_id: {
        type: Sequelize.STRING
      },
      card_Name: {
        type: Sequelize.STRING
      },
      card_ExpYear: {
        type: Sequelize.INTEGER
      },
      card_ExpMonth: {
        type: Sequelize.INTEGER
      },
      card_Number: {
        type: Sequelize.INTEGER
      },
      card_CVC: {
        type: Sequelize.INTEGER
      },
      source: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Add_cards');
  }
};