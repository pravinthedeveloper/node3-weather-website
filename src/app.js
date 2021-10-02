const path = require('path') // Core node module
const express = require('express');
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// console.log(__dirname) // Node variable
// console.log(path.join(__dirname, '../public')) // Node variable

const app = express();
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req,res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Pravin Kunhiraman'
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About me',
        name: 'Pravin Kunhiraman'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help',
        message: 'This is the help page for weather app',
        name: 'Pravin Kunhiraman'
    })
})

app.get('/weather', (req, res) => {

    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({
                error: error
            })
        }
        forecast(latitude, longitude, (error, {weather, temperature, feelslike} = {}) => {
            if (error) {
                return res.send({
                    error: error
                })
            }

            res.send({
                forecast: weather,
                temperature: temperature,
                feelslike: feelslike,
                location: location,
                addressQuery: req.query.address
            })
        })
    })

})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    } 

    console.log(req.query.search, req.query.rating)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help',
        errorMessage: 'Help article not found.',
        name: 'Pravin Kunhiraman'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Page not found',
        errorMessage: 'Page not found.',
        name: 'Pravin Kunhiraman'
    })
})

app.listen(port, () => {
    console.log('Server is up on port '+ port)
})