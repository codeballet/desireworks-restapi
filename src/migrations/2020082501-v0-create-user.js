const { Sequelize } = require('sequelize');

async function up(queryInterface) {
    try {
        await queryInterface.createTable('Users', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password_hash: {
                type: Sequelize.STRING,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    } catch (e) {
        console.log(`Migration error: ${e}`)
    }
}

async function down(queryInterface) {
    await queryInterface.dropTable('Users');
}

module.exports = { up, down };