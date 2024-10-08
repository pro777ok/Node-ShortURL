const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const HOST = 'localhost';
const PORT = 8080;

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Route for serving the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Route to handle GET requests
app.get('/re', (req, res) => {
    console.log('Received GET request');
    const req1 = req.query.id;
    console.log(req1);

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data file');
        }
        const json_dict = JSON.parse(data);
        const url = json_dict[req1] || 'NotFound';

        // Render the EJS template and pass the URL variable
        res.render('url', { url: url });
    });
});

// Route to handle POST requests
app.post('/sampleform-post', (req, res) => {
    console.log('Received POST request');
    const req1 = req.body.data;

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading data file');
        }
        const json_dict = JSON.parse(data);
        const rand = Math.floor(Math.random() * (99999 - 11111 + 1)) + 11111;
        json_dict[rand] = req1;

        fs.writeFile('data.json', JSON.stringify(json_dict), (err) => {
            if (err) {
                return res.status(500).send('Error writing to data file');
            }
            res.send(`URL: ${req1} <br><br>ShortURL: ${rand} <br><br>URL: https://sh-x.glitch.me/re?id=${rand}`);
        });
    });
});

// Start the server
app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
});
