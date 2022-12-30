const express = require('express')
const cors = require('cors')

const app = express()

// Config JSON response
app.use(express.json())

//In this project we do not need URLenconded as we are only going to work with json 

// Solve CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000'}))

// Public fold for images
app.use(express.static('public'))

// Routes
const UserRoutes = require('./routes/UserRoutes')
const SportRoutes = require('./routes/SportRoutes')

app.use('/users', UserRoutes)
app.use('/sports', SportRoutes)

app.listen(5000)