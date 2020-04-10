const express = require('express');
const path = require('path');

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'quote-book/build')));

// An api endpoint that returns a short list of items
app.get('/api/getQuotes', (req,res) => {
    if(req.connection.remoteAddress == 'localhost') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ "Quote": "Testing 123", "Person": "John Doe", "DateAdded": "Yesterday" }));
    }
    else {
        res.send(401,"No");
    }
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/quote-book/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);