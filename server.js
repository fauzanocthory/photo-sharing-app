const express = require('express')
const app = new express()
const port = 8081
app.use(express.static('public'))
app.set("view engine", "ejs")
app.listen(port, ()=>{
    console.log(`Serving photo on http://localhost:${port}`)
})

app.get("/", (request, response) => {
    response.render("index")
})