const express = require('express');
const path = require('path');
const cors = require('cors');
const needle = require('needle')
const crypto = require('crypto')

const session = require('express-session')
var MemcachedStore = require('connect-memjs')(session);
const app = express();


/***
 * Important Variables
 */
const DISCORD_API = 'https://discordapp.com/api/v6';
const DISCORD_CLIENTID = process.env.DISCORD_CLIENTID
const DISCORD_SECRET = process.env.DISCORD_SECRET
let REDIRECT_URI = 'https://quotes-book.herokuapp.com/login/discord/callback'
const QUOTES_API = 'https://custardquotesapi.azurewebsites.net'
const APIKey = process.env.API_KEY
if(process.env.IS_DEV) {
    console.log("Starting in development mode. Make sure this is not running for production")
    REDIRECT_URI = 'http://localhost:5000/login/discord/callback'
    app.use(cors({
        origin: 'http://localhost:3000'
    }));
}


/***
 * Middleware
 */
app.use(session({
    store: new MemcachedStore({
        servers: [process.env.MEMCACHIER_SERVERS],
        prefix: '_session_'
      }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie : {
        secure: false,
        maxAge: 1000*60*60*24*7
    }
}));

let isValid = (value) => (value == 'http://localhost:5000/' || value == 'http://localhost:3000/' || value == 'https://quotes-book.herokuapp.com/')
const apiCall = (req, res, next) => {
    if(!isValid(req.get('referer'))) {
        res.send(401,"Access Denied From");
    }
    else {
        next();
    }
}

const redirectLogin = (req, res, next) => {
    let token = req.session.token
    if(!token) {
        console.log(req.path + ":" + req.session.token);
        res.redirect('/login');
    }
    else {
        console.log(req.session.token)
        next();
    }
}

const redirectHome = (req, res, next) => {
    if(req.session.token) {
        res.redirect('/');
    }
    else {
        next();
    }
}


/***
 * DISCORD API CALLS
 */
function discordGetToken(req, refresh=false) {
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
            params.refresh_token = req.session.refresh_token
        }

        needle.post(`https://discordapp.com/api/v6/oauth2/token`, params, options, (error, response) => {
            console.log(response.body)
            if (!error && response.statusCode == 200) {
                resolve(response);
            }
            else   
                reject(error + " ||| " + response.statusCode);
        });
    });
}

function discordGetUser(token) {
    return new Promise((resolve, reject) => {
        options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    
        needle.request('get', `${DISCORD_API}/users/@me`, null, options, (error, response) => {
            if(!error && response.statusCode == 200) {
                console.log('Inside request: ' + response.body)
                resolve(response.body);
            }
            else {
                reject();
            }
        });

    });    
}

function discordGetUserServers(token) {
    return new Promise((resolve, reject)=>{
        options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        needle.request('get', `${DISCORD_API}/users/@me/guilds`, null, options, (error, response) => {
            if(!error && response.statusCode == 200) {
                let servers = response.body.map((server) => server.id)
                resolve(servers);
            }
            else {
                reject();
            }
        });
    })
}


/***
 * QUOTES API
 */
app.get('/api/getQuotes', apiCall, (req, res) => {
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
            console.log(error + " ||| " + response.statusCode);
    })
});


/***
 * LOGIN ROUTES
 */

app.get('/login', redirectHome, (req, res) =>{
    res.sendFile(path.join(__dirname+'/login.html'))
})
app.get('/login/discord', redirectHome, (req, res) => {
    console.log("Logging in with discord");
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${DISCORD_CLIENTID}&scope=identify%20email%20guilds&response_type=code&redirect_uri=${REDIRECT_URI}`);
});

app.get('/login/discord/callback', redirectHome, (req, res) => {
    console.log("Attemping to log in...")
    discordGetToken(req)
    .then((response) => {
        req.session.token = response.body.access_token;
        req.session.refresh_token = response.body.refresh_token;
        req.session.expires = new Date().getTime()/1000 + response.body.expires_in;
        discordGetUser(req.session.token).then((userInfo) => {
            req.session.email = userInfo.email;
            req.session.discord_id = userInfo.id;
            console.log('id: ' + userInfo.id)
            discordGetUserServers(req.session.token).then((servers) =>{
                req.session.servers = servers;
                console.log(req.session.servers)
            })
            res.redirect("/");
        })
    }).catch((err) => {
        console.log(err);
    })
    
});

/***
 * STATIC FILES
 */
app.get('*', redirectLogin, (req,res) =>{
    res.sendFile(path.join(__dirname+'/quote-book/build'+req.path));    
});

const port = process.env.PORT || 5000;
app.listen(port);
console.log('App is listening on port ' + port);


///var id = crypto.randomBytes(20).toString('hex');
