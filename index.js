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
let QUOTES_API = 'https://custardquotesapi.azurewebsites.net'
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

let isValid = (value) => (/(http:\/\/localhost:5000\/|https:\/\/quotes-book\.herokuapp\.com\/|http:\/\/localhost:3000\/)($|(notebook\/\d+))/.test(value))
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
        // console.log(req.session.token)
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
                // console.log('Inside request: ' + response.body)
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
function addUserToGroup(userId, groupId) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                ApiKey: APIKey
            }
        }

        needle.request('post', `${QUOTES_API}/Groups/UserGroups?userId=${userId}&groupId=${groupId}`, null, options, (error, response) => {
            if(!error && response.statusCode == 200) {
                resolve(response.body)
            } 
            else {
                console.log(response.body)
                reject("Failed to add owner. Status: " + response.statusCode)
            }
        });
    })
}

app.get('/api/getUser', apiCall, (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const options = {
        headers: {
            ApiKey: APIKey
        }
    }
    
    needle.put(`${QUOTES_API}/Users/discord/${req.session.discord_id}?email=${req.session.email}`, null, options, (error, response) => {
        if (!error && response.statusCode == 200) {
            req.session.userId = response.body.id;
            res.send(response.body);
        }
        else   
            console.log(response.statusCode + "Failed to retrieve user...");
    })
});

app.get('/api/getQuotes', apiCall, (req, res) => {
    let groupIds = req.session.groups.map((group) => group.groupId)
    if(groupIds.indexOf(parseInt(req.param('groupId'))) != -1) {
        res.setHeader('Content-Type', 'application/json');
        
        const options = {
            headers: {
                ApiKey: APIKey
            }
        }

        const params = {
            groupID: req.param('groupId')
        }
        
        needle.request('get', `${QUOTES_API}/Quotes/byGroup`, params, options, (error, response) => {
            if (!error && response.statusCode == 200) {
                res.send(response.body);
            }
            else   
                console.log("Failed to retrieve group");
        })
    }
    else {
        res.send(401);
    }
});

app.get('/api/addDiscordGroups', apiCall, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    const options = {
        json: true,
        headers: {
            ApiKey: APIKey
        }
    }

    discordGetUserServers(req.session.token).then((servers) =>{
        req.session.servers = servers;        
        const data = JSON.stringify(req.session.servers);
        let uri = `${QUOTES_API}​/Groups/discord/${encodeURI(req.session.userId)}`;
        console.log(uri)

        //204 on success
        needle.request('put', uri, data, options, (error, response) => {
            if (!error)
                res.sendStatus(response.statusCode);
            else   
                console.log(error + ": Failed to insert groups");
        });
    })
    .catch((err) => {
        console.log(err)
    })
});

app.get('/api/userGroups', apiCall, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    const options = {
        headers: {
            ApiKey: APIKey
        }
    }
    //200 Ok 
    needle.request('get', encodeURI(`${QUOTES_API}/Groups/UserGroups/${req.session.userId}`), null, options, (error, response) => {
        if (!error && response.statusCode == 200) {
            req.session.groups = response.body;
            res.send(response.body);
        }           
        else   
            console.log(error + "Failed to retrieve group");
    });
});

app.post('/api/newGroup', apiCall, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    const options = {
        json: true,
        headers: {
            ApiKey: APIKey
            
        }
    }

    const data = {
        name: req.param('groupName'),
        owner: req.session.userId
    }

    //200 Ok 
    needle.request('post', `${QUOTES_API}/Groups/`, data, options, (error, response) => {
        if (!error && response.statusCode == 200) {
            req.session.groups.push(response.body);
            addUserToGroup(req.session.userId, response.body.groupId)
                .then(() => {console.log(response.body); res.send(response.body);})
                .catch((err) => {console.log(err); res.send(500, err);})            
        }           
        else {
            console.log(response.statusCode + " Failed to add group");
            res.send(500);
        }
    });
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
            // console.log(userInfo.email)
            req.session.email = userInfo.email;
            req.session.discord_id = userInfo.id;
            // console.log('id: ' + userInfo.id)
            
            res.redirect("/");
        })
    }).catch((err) => {
        console.log(err);
    })
});

app.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy();
    req.session = null;
    res.redirect("/login");
});

/***
 * STATIC FILES
 */
app.get('/*', redirectLogin, (req,res) =>{
    if(req.path == "" || /\/notebook\/\d/.test(req.path))
        res.sendFile(path.join(__dirname, '/quote-book/build/index.html'));    
    else
        res.sendFile(path.join(__dirname, '/quote-book/build/' + req.path));
});

const port = process.env.PORT || 5000;
app.listen(port);
console.log('App is listening on port ' + port);


///var id = crypto.randomBytes(20).toString('hex');
