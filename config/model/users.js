const { DataTypes } = require('sequelize')
const db = require('../db/db')

const Users = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(10),
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
}, {
    freezeTableName: true
})

Users.sync({ alter: true })
    .then(() => { console.log('Users table sync') })

module.exports = Users