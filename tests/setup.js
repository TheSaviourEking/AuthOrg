const { sequelize } = require('../db/models');

before(async () => {
    // Sync the database before running tests
    await sequelize.sync({ force: true });
});

after(async () => {
    // Close the database connection after tests are done
    await sequelize.close();
});
