const express = require('express')
const PhotosRouter = express.Router()
const db = require('../models')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

PhotosRouter.route('/')
    .get((request, response) => {
        db.photo
            .findAll()
            .then((photos) => {
                console.log("GET Images")
                response.send(photos)
                // response.redirect('/')
            })
            .catch((error) => {
                response.send(error)
            })
    })

PhotosRouter.route('/')
    .post(upload.single("photo"), (request, response) => {
        const title = request.body.title
        const medialocation = request.file.filename
        db.photo
                .create({ 
                    title: title, 
                    medialocation: medialocation, 
                })
                .then((photo) => {
                    console.log("POST Images")
                    // response.send(photo)
                    response.redirect('/')
                })
                .catch((error) => {
                    response.send(error)
                })
    })

PhotosRouter.route('/:photoId')
    .get(upload.single("photo"), (request, response) => {
        const photoId = request.params.photoId
        db.comment
            .findAll({
                where: {
                    photoId: photoId,
                }
            })
            .then((comment) => {
                response.send(comment)
            })
            .catch((error) => {
                response.send(error)
            })
    })

    module.exports = PhotosRouter