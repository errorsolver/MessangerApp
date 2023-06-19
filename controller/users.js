const jwt = require('jsonwebtoken')
const models = require('../config/model/model-collection')
const { Op } = require('sequelize')

const usersController = {}

// TODO: use handlerErrors after all done
const handlerErrors = (err) => {
     ('err: ', err);

    let errors = { username: '', password: '' }

    if (err == 'User not found') {
        errors.username = err
    }

    try {
        if (err.name.includes('SequelizeUniqueConstraintError')) {
            Object.values(err.errors).forEach((properties) => {
                errors[properties.path] = properties.message
            })
        }
        
        if (errors.username == 'username must be unique') {
            errors.username = 'Username already taken'
        }
    } catch (e) {
         ('not really error, just fine... ;)')
    }
    return errors
}

usersController.getUsersExcept_get = async (req, res) => {
    try {
        const token = req.cookies._jwt
        const thisUserId = jwt.verify(token, process.env.PASSCODE)

        const users = await models.Users.findAll({
            where: {
                [Op.not]: { id: thisUserId }
            }
        })
        res.status(200).json({
            message: 'Success get all users',
            users
        })
    } catch (error) {
        res.status(400).json({
            message: 'Fail get all users',
            error
        })
    }
}

usersController.signup_get = async (req, res) => {
    res.render('pages/signup')
}
usersController.signup_post = async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await models.Users.create({
            username, password
        })

        // await login(res, username, password)

        res.status(200).json({
            message: 'Success input user',
            user,
            // token: req.cookies._jwt
        })
    } catch (error) {
        const errors = handlerErrors(error)
        res.status(404).json({
            errors
        })
    }
}

usersController.login_get = (req, res) => {
    res.render('pages/login')
}
usersController.login_post = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await models.Users.findOne({
            where: {
                username, password
            }
        })

        // TODO: slice user and pass function
        // password that get from client compared with user data that collected from db
        // inner every if, throw error when 1 of them is not match

        if (user == null) throw 'User not found'

        const token = jwt.sign(user.id, process.env.PASSCODE)

        // const header = res.setHeader('Set-Cookie', `jwt123=${token}; Path=/; Max-Age=10000`)
        // res.setHeader('Set-Cookie', 'nama_cookie=nilai_cookie; Path=/; Max-Age=3600');

        // res.cookie('_jwt', token, {
        //     maxAge: new Date(new Date().getTime() + Number(process.env.TOKENEXPMS)),
        //     // secure: false,
        //     httpOnly: true
        // })

        // res.setHeader('Set-Cookie', `_jwt=${token}; Path=/; HttpOnly; SameSite=Strict`);

        // if(process.env.NODE_ENV == 'production') cookieOptions.secure = true

        const envType = process.env.NODE_ENV
        const secure = envType == 'production' ? true : false

        res.status(200)
            .cookie('_jwt', token, {
                maxAge: new Date(Date.now() + Number(process.env.TOKENEXPMS)),
                secure,
                httpOnly: true
            })
            .json({
                message: 'Login Success',
                token,
                user,
            })
    } catch (err) {
        errors = handlerErrors(err)
        res.status(400).json({
            message: 'Login Fail',
            errors
        })
    }
}

usersController.logout_get = async (req, res) => {
    try {
        res.status(200)
            .cookie('_jwt', '', {
                maxAge: 0
            })
            .json({
                message: 'Logged out'
            })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
}

module.exports = usersController