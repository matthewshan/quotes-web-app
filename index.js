const express = require('express');
const path = require('path');
const cors = require('cors');
const needle = require('needle')
const crypto = require('crypto')

const app = express();

const APIKey = process.env.API_KEY
const API_ENDPOINT = 'https://discordapp.com/api/v6';
const DISCORD_CLIENTID = process.env.DISCORD_CLIENTID
const DISCORD_SECRET = process.env.DISCORD_SECRET
let REDIRECT_URI = 'https://quotes-book.herokuapp.com/api/discord/login/'

let apiBaseUrl = 'https://custardquotesapi.azurewebsites.net'


if(process.env.IS_DEV) {
    console.log("Starting in development mode. Make sure this is not running for production")
    REDIRECT_URI = 'http://localhost:5000/api/discord/login'
    app.use(cors({
        origin: 'http://localhost:3000'
    }));
}

let isValid = () => (value == 'http://localhost:5000/' || value == 'http://localhost:3000/' || value == 'https://quotes-book.herokuapp.com/')


// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'quote-book/build')));

// An api endpoint that returns a short list of items
app.get('/api/getQuotes', (req,res) => {
    if(isValid(req.get('referer'))) {
        res.setHeader('Content-Type', 'application/json');
        
        const options = {
            headers: {
                ApiKey: APIKey
            }
        }

        const params = {
            groupID: 3
        }
        
        needle.request('get', `${apiBaseUrl}/Quotes/byGroup`, params, options, (error, response) => {
            if (!error && response.statusCode == 200)
                res.send(response.body); //TODO THE REASON WHY ITS NOT WORKING IS BECAUSE YOU NEED TO REDIRECT
            else   
                console.log(error + " ||| " + response.statusCode)
        })

    }
    else {
        res.send(401,"Access Denied From");
    }
});

app.get('/login', (req, res) => {
    console.log("Logging in with discord")
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${DISCORD_CLIENTID}&scope=identify%20email%20guilds&response_type=code&redirect_uri=${REDIRECT_URI}`);
});

app.get('/api/discord/login', (req, res) => {
    console.log("Attemping to log in...")
    if (!req.query.code) throw new Error('NoCodeProvided');
    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }

    console.log(req.query.code);
    data = {
        client_id: DISCORD_CLIENTID,
        client_secret: DISCORD_SECRET,
        grant_type: 'authorization_code',
        code: req.query.code,
        redirect_uri: REDIRECT_URI,
        scope: 'identify email guilds'
    }

    needle.post(`https://discordapp.com/api/v6/oauth2/token`, data, options, (error, response) => {
        console.log(response.body)
        if (!error && response.statusCode == 200)
            res.redirect(`/api/discord/auth?token=${response.body.access_token}`)
        else   
            console.log(error + " ||| " + response.statusCode)
    });
});

app.get('/api/discord/auth', (req, res) => {
    res.send(req.body)
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/quote-book/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);


///var id = crypto.randomBytes(20).toString('hex');