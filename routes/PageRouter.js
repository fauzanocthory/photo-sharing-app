const express = require('express')
const PageRouter = express.Router()
const db = require('../models')

//ROUTES
PageRouter.get("/", (request, response) => {
    console.log(request.session.userId)
    if(request.session.userId) {
        db.photo.findAll().then((photos) => {
            console.log("GET Images")
            response.render('index', {data: photos})
        })
        .catch((error) => {
            response.send(error)
        })
    } else {
        response.redirect('/login')
    }
})
PageRouter.get('/photo', (request, response) => {
    console.log(request.session.userId)
    if (request.session.userId) {
        response.render('photo')
    } else {
        response.redirect('/login')
    }
})

PageRouter.get("/login", (request, response) => {
    console.log("/LOGGING IN")
    response.render("logIn")
})

PageRouter.get("/signup", (request, response) => {
    console.log("/SIGN UP")
    response.render("signUp")
})

PageRouter.get("/logout", (request, response) => {
    console.log("/LOG OUT - ", request.session.userId)
    request.session.destroy(() => {
        response.redirect('/login')
    })
})

module.exports = PageRouter