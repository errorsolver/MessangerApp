# Messanger App

Message to some stranger and be friend with them.

## Instalation

1. Clone this git
2. Install all dependency using `npm i`
3. Create file named `.env` in the root of the app folder
4. Insert `TOKENEXPMS = (time in milisecond)` for cookies expire time, `PASSCODE = (your passcode for jwt)`, `URI = (insert uri db)`
5. Run code with `node start` in terminal
6. Open browser with address `localhost:3000/` and you will be redirected to app homepage

## Routes

| Method | Route          | Description                   | require                       |
| ------ | -------------- | ----------------------------- | ----------------------------- |
| GET    | /              | homepage                      |
| GET    | /user/login    | user login page               |
| POST   | /user/login    | user login                    | username, password            |
| GET    | /user/signup   | user signup page              |
| POST   | /user/signup   | user signup                   | username, password            |
| GET    | /user/getusers | get all users except yourself |
| GET    | /message/send  | message page                  |
| POST   | /message/send  | send message                  | senderId, receiverId, message |
| POST   | /message/get   | get message from stranger     | senderId, receiverId          |

## Other Information

- langguage: javascript, ejs
- framework: express
- runtime environment: nodejs

## ENV

- NODE_ENV = [development, test, production] STRING
- URI = [URI] STRING || neon.tech
- DB_HOST = [POSTGRES HOST] STRING
- DB_NAME = [POSTGRES NAME] STRING
- DB_USER = [POSTGRES USERNAME] STRING
- DB_PASSWORD = [POSTGRES PASSWORD] STRING
- PORT = [NUMBER] INT
- PASSCODE = [RANDOM TEXT] STRING
- TOKENEXPMS = [MILISECOND] INT
