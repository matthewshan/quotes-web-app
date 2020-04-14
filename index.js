const express = require('express');
const path = require('path');
const cors = require('cors');
const needle = require('needle')
const crypto = require('crypto')
const session = require('express-session')

const app = express();
// app.use(express.static(path.join(__dirname, 'quote-book/build')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));


const DISCORD_API = 'https://discordapp.com/api/v6';
const DISCORD_CLIENTID = process.env.DISCORD_CLIENTID
const DISCORD_SECRET = process.env.DISCORD_SECRET
let REDIRECT_URI = 'https://quotes-book.herokuapp.com/api/discord/login/'

const QUOTES_API = 'https://custardquotesapi.azurewebsites.net'
const APIKey = process.env.API_KEY

let isSecure = true

if(process.env.IS_DEV) {
    isSecure = false
    console.log("Starting in development mode. Make sure this is not running for production")
    REDIRECT_URI = 'http://localhost:5000/api/discord/login'
    app.use(cors({
        origin: 'http://localhost:3000'
    }));
}

let isValid = (value) => (value == 'http://localhost:5000/' || value == 'http://localhost:3000/' || value == 'https://quotes-book.herokuapp.com/')


function discordToken(req, refresh=false) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }

        let params = {
            client_id: DISCORD_CLIENTID,
            client_secret: DISCORD_SECRET,            
            redirect_uri: REDIRECT_URI,
            scope: 'identify email guilds'
        }

        if(!refresh) {
            params['grant_type'] = 'authorization_code'
            params['code'] = req.query.code
        }
        else {
            params.grant_type = 'refresh_token'
            params.refresh_token = '' //TODO
        }

        needle.post(`https://discordapp.com/api/v6/oauth2/token`, params, options, (error, response) => {
            console.log(response.body)
            if (!error && response.statusCode == 200) {
                resolve(response)
            }
            else   
                reject(error + " ||| " + response.statusCode)
        });
    });
}

// Discord functions
function discordUser() {
    needle.get(`${DISCORD_API}/users/@me`)
}


// An api endpoint that returns a short list of items
app.get('/api/getQuotes', (req, res) => {
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
        
        needle.request('get', `${QUOTES_API}/Quotes/byGroup`, params, options, (error, response) => {
            if (!error && response.statusCode == 200)
                res.send(response.body);
            else   
                console.log(error + " ||| " + response.statusCode)
        })

    }
    else {
        res.send(401,"Access Denied From");
    }
});

// Login route
app.get('/login', (req, res) => {
    console.log("Logging in with discord")
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${DISCORD_CLIENTID}&scope=identify%20email%20guilds&response_type=code&redirect_uri=${REDIRECT_URI}`);
});

//Discord Login Callback
app.get('/api/discord/login', (req, res) => {
    console.log("Attemping to log in...")
    if (!req.query.code) throw new Error('NoCodeProvided');
    discordToken(req)
    .then((response) => {
        req.session.token = response.body.access_token
        req.session.refresh_token = response.body.refresh_token
        req.session.expires = new Date().getTime()/1000 + response.body.expires_in
        console.log("User logged in")
        res.redirect("/")
    }).catch((err) => {
        console.log(err)
    })
    
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    console.log("Static File Requested")
    console.log(req.session.token)
    if(!req.session.token) {
        console.log("User must login first")
        res.redirect('/login')
    }
    else {
        console.log("Sending Static File")
        res.sendFile(path.join(__dirname+'/quote-book/build/index.html'));
    }
    console.log("======")
});

const port = process.env.PORT || 5000;
app.listen(port);
console.log('App is listening on port ' + port);


///var id = crypto.randomBytes(20).toString('hex');