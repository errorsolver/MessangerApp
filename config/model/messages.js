const { DataTypes } = require('sequelize')
const db = require('../db/db')
const Users = require('../model/users')

const Messages = db.define('messages', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true
})

Messages.belongsTo(Users, {
    foreignKey: 'senderId',
    targetKey: 'id'
})
Messages.belongsTo(Users, {
    foreignKey: "receiverId",
    targetKey: 'id'
})

Messages.sync({ alter: true })
    .then(() => { console.log('Messages table sync') })

module.exports = Messages