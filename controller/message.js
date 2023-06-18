const jwt = require('jsonwebtoken')
const models = require('../config/model/model-collection')

const messageController = {}

messageController.getMessage_post = async (req, res) => {
    const { receiverId } = req.body

    try {
        const token = req.cookies._jwt
        const thisUserId = jwt.verify(token, process.env.PASSCODE)
        const senderMessages = await models.Messages.findAll({
            where: {
                receiverId: receiverId,
                senderId: thisUserId
            }
        })
        const receiverMessages = await models.Messages.findAll({
            where: {
                receiverId: thisUserId,
                senderId: receiverId
            }
        })

        res.status(200).json({
            message: 'Success get messages',
            senderMessages,
            receiverMessages
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
}

messageController.sendMessage_post = async (req, res) => {
    try {
        const { receiverId, message } = req.body
        if(message == '') throw "Message input cant be null"
        const token = await req.cookies._jwt
        const senderId = jwt.verify(token, process.env.PASSCODE)

        const messageData = await models.Messages.create({
            senderId, receiverId, message
        })

        res.status(200).json({
            message: 'Success sending message',
            data: messageData
        })
    } catch (error) {
        res.status(400).json({
            message: 'Fail sending message',
            error
        })
    }
}

messageController.sendMessage_get = (req, res) => {
    res.render('pages/message')
}

module.exports = messageController