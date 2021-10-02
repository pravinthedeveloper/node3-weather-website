const request = require('request')

const forecast = (lat, long, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=18a043134032ef695da72e39e814d0be&query='+lat+','+long
    request({url: url, json: true}, (error, {body}) => {
        if (error) {
            callback('Weather service is not active', undefined)
        } else if (body.error) {
            callback('Weather service has failed. Please try with another city', undefined)
        } else {
            callback(undefined, {
                location: body.location.name + ', ' + body.location.country,
                weather: body.current.weather_descriptions[0],
                temperature: body.current.temperature,
                feelslike: body.current.feelslike,
                uvindex: body.current.uv_index
            })
        }
    })
}

module.exports = forecast