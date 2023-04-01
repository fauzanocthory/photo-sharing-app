const express = require('express')
const UsersRouter = express.Router()
const db = require('../models')
const bodyParser = require('body-parser')
UsersRouter.use(bodyParser.urlencoded({ extended: true }))
UsersRouter.use(bodyParser.json({ extended: true }))
const bcrypt = require('bcryptjs')
const saltRounds = 10

UsersRouter.route('/login').post(async (request, response) => {
        console.log(request.body)
        const username = request.body.username
        const password = request.body.password
        db.user
            .findOne({ where: { username: username } })
            .then(async (user) => {
                if (user) {
                    await bcrypt.compare(password, user.password, (error, same) => {
                    if (same) {
                        request.session.userId = user.id
                        console.log(request.session)
                        console.log("logged In")
                        response.redirect('/')
                    } else {
                        console.log("this fired")
                        response.redirect('/login')
                    }
                })
            }
        })
            .catch((error) => {
                console.log(error)
                response.send(error)
            })
        })

UsersRouter.route('/signup')
    .post(async (request, response) => {
        const password = request.body.password
        const encryptedPassword = await bcrypt.hash(password, saltRounds)
        const email = request.body.email
        const username = request.body.username
        
        db.user
            .create({  
                        email: email[0], 
                        password: encryptedPassword,
                        username: username 
                    })
            .then(user => {
                // response.send(user)
                response.redirect('/login')
            })
            .catch((error) => {
                response.send(error)
            })
    })

    module.exports = UsersRouter