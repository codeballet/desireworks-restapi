const { Sequelize } = require('sequelize');

async function up(queryInterface) {
	try {
		await queryInterface.createTable('FeedItems', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true
			},
			caption: {
				type: Sequelize.STRING,
				allowNull: false
			},
			url: {
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
	await queryInterface.dropTable('FeedItems');
}

module.exports = { up, down };