const express = require('express')
const CommentsRouter = express.Router()
const db = require('../models')
const bodyParser = require('body-parser');
CommentsRouter.use(express.static("public"));

CommentsRouter.use(bodyParser.urlencoded({extended: false}));
CommentsRouter.use(bodyParser.json());

CommentsRouter.route('/:photoId')
    .get((request, response) => {
        const photoId = request.params.photoId
        db.comment
            .findAll({
                where: { photoId: photoId }
            })
            .then((comment) => {
                db.photo.findAll({
                    where: { Id: photoId}
                })
                .then((photo) => {
                    response.render("comment", { 
                        photo: photo, 
                        comment: comment, 
                        requestURL: request.url
                    })
                })
                .catch((error) => {
                    console.log(error)
                    response.send(error)
                })
            })
    })
CommentsRouter.route('/:photoId')
    .post((request, response) => {
        console.log(request.body)
        const photoId = request.params.photoId
        const content = request.body.comment
        db.comment  
            .create({ 
                photoId: photoId, 
                content: content
            })
            .then((comment) => {
                response.redirect(`/comments${request.url}`)
            })
            .catch((error) => {
                response.send(error)
            })
    })



    module.exports = CommentsRouter