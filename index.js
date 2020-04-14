const express = require('express');
const path = require('path');
const cors = require('cors');
const needle = require('needle')

const app = express();

const APIKey = process.env.API_KEY

let apiBaseUrl = 'https://custardquotesapi.azurewebsites.net'

process.env.IS_DEV = process.argv[2] == 'dev'

if(process.env.IS_DEV) {
    app.use(cors({
        origin: 'https://localhost:3000'
      }));
}

let isValid = function refer(value) {
    return (value == 'http://localhost:5000/' || value == 'http://localhost:3000/' || value == 'https://quotes-book.herokuapp.com/')
}

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
                res.send(response.body);
            else   
                console.log(error + " ||| " + response.statusCode)
        })

    }
    else {
        res.send(401,"Access Denied From");
    }
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/quote-book/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);