// models/userOrganisation.js
module.exports = (sequelize, DataTypes) => {
  const UserOrganisation = sequelize.define('UserOrganisation', {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', // name of the target model
        key: 'userId', // key in the target model
      }
    },
    organisationId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Organisations', // name of the target model
        key: 'orgId', // key in the target model
      }
    }
  }, {});

  return UserOrganisation;
};
