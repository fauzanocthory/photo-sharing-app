const { response } = require('express')
const express = require('express')
const app = new express()
const db = require('./models')
const cors = require("cors")
const CommentsModel = require('./models/CommentsModel')
const Sequelize = require("sequelize");
let cookieParser = require("cookie-parser");
app.use(
    cors({
        origin: "https://modern-lime-hospital-gown.cyclic.app",
        methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
        credentials: true
    })
)
const oneDay = 1000 * 60 * 60 * 24;

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

const logger = require("morgan")

app.use(express.static('public'))
app.set("view engine", "ejs")
app.set("trust proxy", 1);
app.use(logger("dev"))
app.use(cookieParser());

const session = require('express-session')
app.use(session({
    secret: "SECRET_KEY_FOR_SESSION",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: oneDay, secure: true },
}));

global.loggedIn = null
app.use("*", (request, response, next) => {
    loggedIn = request.session.userId
    next()
})


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

