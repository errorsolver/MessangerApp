const {Sequelize} = require('sequelize')

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

module.exports = db