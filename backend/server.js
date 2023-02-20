const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const axios = require('axios')
const morgan = require('morgan')


// setting up the server:
const server = express()

// setting up the port
dotenv.config({path:'config.env'})
const PORT = process.env.PORT || 3001
const API_KEY = process.env.API_KEY

server.listen(PORT, () =>{
    console.log(`server is running on localhost:${PORT}`)
})

// API setup
let lat = 2.9739323
let lon = 29.9739323
const weatherAPI = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`

// middleware config
server.use(cors())
server.use(express.json()) // allow my express server to read JSON
// logging 
server.use(morgan('tiny'))



// create end-point for the test of configuration with react client side
server.get("/api", (req, res) => {
    console.log(res.status)
    res.json({ message: "Hello from Express!" });
  });
  
server.get("/api/weather/:latlon", (req, res) => {
    const latlon = req.params.latlon.split(',')
    lat = latlon[0]
    lon = latlon[1]
    console.log(lat,lon)
    axios.get(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`,{ 
        headers: { "Accept-Encoding": "gzip,deflate,compress" } 
    })
        .then(response => {
            // console.log(response.data)
            res.json(response.data)
        })
        .catch(err=>{console.log('err')})
  });
  

server.post('/api', (request, response) => {
    // the request is all the information the client sent 

    console.log(`I received a request!`) // this means the post from the client side was successful and sent to the user
    // the response is the data I might send from the server, I'm the one who's taking action on that 
    lat = request.body.latitude
    lon = request.body.longitude
    response.send({
        status: 'success',
        lat: request.body.latitude,
        lon: request.body.longitude
    })
})

// create the api for the forecast weekly weather data 

server.get("/api/weather/forecast/:latlon", (req, res) => {
    const latlon = req.params.latlon.split(',')
    lat = latlon[0]
    lon = latlon[1]
    console.log(lat,lon)

    axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=10&aqi=no&alerts=yes
    `,{ 
        headers: { "Accept-Encoding": "gzip,deflate,compress" } 
    })
        .then(response => {
            // console.log(response.data)
            res.json(response.data)
        })
        .catch(err=>{res.json({ err })})
  });