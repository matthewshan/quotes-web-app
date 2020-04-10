const express = require('express');
const path = require('path');
var cors = require('cors');

const app = express();

if(process.argv[2] == 'dev') {
    //TODO: Enable CORS here when in dev mode
    app.use(cors({
        origin: 'http://localhost:3000'
      }));
}

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'quote-book/build')));

// An api endpoint that returns a short list of items
app.get('/api/getQuotes', (req,res) => {
    if(req.headers.host.split(':')[0] == 'localhost') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(
            [{"Quote": "Testing 123", "Person": "John Doe", "DateAdded": "Yesterday"}]
        ));
    }
    else {
        res.send(401,"Access Denied From: "+req.headers.host);
    }
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/quote-book/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);