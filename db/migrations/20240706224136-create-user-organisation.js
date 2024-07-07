'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserOrganisations', {
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users', // name of the target model
          key: 'userId', // key in the target model
        }
      },
      organisationId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Organisations', // name of the target model
          key: 'orgId', // key in the target model
        }
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
    await queryInterface.dropTable('UserOrganisations');
  }
};
