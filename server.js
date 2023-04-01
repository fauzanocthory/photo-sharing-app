const { response } = require('express')
const express = require('express')
const app = new express()
const db = require('./models')
const CommentsModel = require('./models/CommentsModel')

const bodyParser = require('body-parser')
app.use(bodyParser.json())

global.loggedIn = null
const session = require('express-session')
app.use(session({
    name : 'codeil',
    secret : 'something',
    resave :false,
    saveUninitialized: true,
    cookie : {
            maxAge:(1000 * 60 * 100)
    }      
}));

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
const sqlPort = 3307
db.sequelize
    .sync({})
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

