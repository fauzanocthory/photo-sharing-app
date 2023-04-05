const express = require('express')
const PageRouter = express.Router()
const db = require('../models')

//ROUTES
PageRouter.get("/", (request, response) => {
    if (request.session.userId) {
      const { exec } = require("child_process");
      exec(
        `for item in $(ls $(pwd)/public/images); do
        if [ $( file --mime-type $(pwd)/public/images/$item -b ) != "image/jpeg" ] && [ $( file --mime-type $(pwd)/public/images/$item -b ) != "image/png" ]; then
        echo "$(pwd)/public/images/$item"
        fi; 
        done;`,
        (error, stdout, stderr) => {
          if (stdout) {
            fs.unlink(stdout.slice(0, -1), (err) => {
              if (err) {
                throw err;
              }
            });
            console.log(`Deleted ${stdout} because it wasn't an image`);
          }
        }
      );
  
      db.photo
        .findAll()
        .then((photos) => {
          console.log("GET IMAGES");
          response.render("index", { data: photos });
        })
        .catch((error) => {
          response.send(error);
        });
    } else {
      response.redirect("/login");
    }
  });


PageRouter.get('/photo', (request, response) => {
    console.log(request.session.id)
    if (request.session.id) {
        response.render('photo')
    } else {
        response.redirect('/login')
    }
})

PageRouter.get("/login", (request, response) => {
    console.log("/LOGGING IN")
    response.render("logIn", {data: ""})
})

PageRouter.get("/badlogin", (request, response) => {
    console.log("/LOGGING IN")
    response.render("logIn", {data: "Bad Login Credentials"})
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

// PageRouter.get("/*", (request, response) => {
//     console.log("404")
//     response.render("404")
// })

module.exports = PageRouter