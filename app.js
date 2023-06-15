const express = require('express')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const ejs = require('ejs')
const path = require('path')
const cors = require('cors')

const usersRoutes = require('./routes/user')
const messageRoutes = require('./routes/message')

const app = express()

app.use(helmet())
app.use(cors(
    {
        origin: 'http://127.0.0.1:5500',
        credentials: true,
    }
))
app.use(cookieParser())
app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('public'))
app.use('/js', express.static(__dirname + '/js'))

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline'");
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie')
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();
});

app.use('/user', usersRoutes)
app.use('/message', messageRoutes)

app.get('/', (req, res) => { res.status(200).send('Welcome To MessagerApp API') })

module.exports = app