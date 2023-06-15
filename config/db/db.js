const {Sequelize} = require('sequelize')

const db = new Sequelize(
    process.env.URI,
    {
        host: process.env.HOST,
        dialect: 'postgres'
    }
)

module.exports = db