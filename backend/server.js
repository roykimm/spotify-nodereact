const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors())
app.use(bodyParser.json())

app.post('/refresh', (req,res) => {
    const refreshToken = req.body.refreshToken
    console.log('hi')
    const spotifyApi = new SpotifyWebApi({
        redirectUri : 'http://localhost:3000',
        clientId : '67c9d920c3564f2d9f2d276ffcf72301', 
        clientSecret : 'de26cd6b4b60468ea09363de72f42820',
        refreshToken
    })

    spotifyApi
        .refreshAccessToken()
        .then(data => {
            res.json({
                accessToken: data.body.accessToken,
                expiresIn : data.body.expiresIn
            })
        })
        .catch(() => {
            res.sendStatus(400)
        })
})

app.post('/login', (req,res) => {
    const code = req.body.code

    const spotifyApi = new SpotifyWebApi({
        redirectUri : 'http://localhost:3000',
        clientId : '67c9d920c3564f2d9f2d276ffcf72301', 
        clientSecret : 'de26cd6b4b60468ea09363de72f42820',
    })

    spotifyApi.authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken : data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn : data.body.expires_in,
            })
            .catch(() => {
                res.sendStatus(400)
            })
    })

})

app.listen(3001);

