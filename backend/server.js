require('dotenv').config()
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser');
const lyricsFinder = require('lyrics-finder')

const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/refresh', (req,res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri : process.env.REDIRECT_URI,
        clientId : process.env.CLIENT_ID, 
        clientSecret : process.env.CLIENT_SECRET,
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
        .catch(err => {
            res.sendStatus(400)
        })
})

app.post("/login", (req, res) => {
    const code = req.body.code

    console.log(process.env.REDIRECT_URI)
    console.log(process.env.CLIENT_ID)
    console.log(process.env.CLIENT_SECRET)

    const spotifyApi = new SpotifyWebApi({
        redirectUri : process.env.REDIRECT_URI,
        clientId : process.env.CLIENT_ID, 
        clientSecret : process.env.CLIENT_SECRET,
    })
  
    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        res.json({
          accessToken: data.body.access_token,
          refreshToken: data.body.refresh_token,
          expiresIn: data.body.expires_in,
        })
      })
      .catch(err => {
        res.sendStatus(400)
      })
})

app.get('/lyrics', async (req,res) => {
    const lyrics = (await lyricsFinder(req.query.artist, req.query.track)) || '가사를 찾지 못했습니다.'
    res.json( {lyrics} )
})

app.listen(3001);

