const { response } = require('express')
const express = require('express')
const app = new express()
const db = require('./models')
const CommentsModel = require('./models/CommentsModel')
const Sequelize = require("sequelize");

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

const logger = require("morgan")
const session = require('express-session')
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'something',
}));
global.loggedIn = null
app.use("*", (request, response, next) => {
    loggedIn = request.session.userId
    next()
})

app.use(logger("dev"))
app.use(express.static('public'))
app.set("view engine", "ejs")

const PhotosRouter = require('./routes/PhotosRouter')
const UsersRouter = require('./routes/UsersRouter')
const CommentsRouter = require('./routes/CommentsRouter')
const PageRouter = require('./routes/PageRouter')

app.use('/images', PhotosRouter)
app.use('/users', UsersRouter)
app.use('/comments', CommentsRouter)
app.use('/', PageRouter)


//DB
const sqlPort = 17589
db.sequelize
    .sync()
    .then(() => {
        app.listen(sqlPort, () => {
            console.log(
                `mariadb connection succesful ~ http://localhost:${sqlPort}`
            )
        })
    })
    .catch((error) => {
        console.error("Unable to connect to the database", error)
    })

//SERVER
const port = 8081
app.listen(port, ()=>{
    console.log(`Serving photo on http://localhost:${port}`)
})

