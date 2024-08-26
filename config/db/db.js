const { Sequelize } = require('sequelize')

const db = new Sequelize(
    process.env.URI,
    {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true
            }
        }
    }
)

try {
    db.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

module.exports = db