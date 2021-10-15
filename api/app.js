const express = require('express');
const cors = require('cors');
const shortid = require('shortid');

const mysql = require('mysql');
const util = require('./util');

//API Setup
const app = express();
app.use(express.json());
app.use(cors());

//API domain/port definitions
const port = process.env.PORT || 8080;
const siteDomain = 'localhost:8080/'
console.log(`default endpoint: localhost:${port}`);


///////////////////// DB Setup

//defining BD connection
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password'
});

//initiating DB connection
con.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      console.log(err);
      return;
    }
    console.log('DB Connection established');
});
con.query('USE urlshortener');



///////////////////// API Request Handling

//handle create new link request
app.post('/create-link', async (req, res) => {
    const userLink = req.body.userLink; //store user provided link

    try {
        //user link validation
        util.validateLink(userLink);
        const feedback = await util.checkIfActive(userLink);

        const genLink = generateShortLink(); //create unique shortlink
        
        //DB query to create new entry,
        const sql = 'INSERT INTO links SET ?';
        let values = util.createURLPair(genLink, userLink);
        con.query(sql, values, (err) => {
            if(err) { //handle DB query error
                console.log(err);
                res.status(500).send('Server Error: Bad Query');
            }
            else res.status(200).json({ result: `${siteDomain}${genLink}`, feedback }); //response to client
        });

    } catch (error) {
        console.log('error: ', error); //api error log
        res.status(400).json({ error }); //error response to client
    }
});

//handle redirect from shortlink
app.get('/:linkID', async (req, res) => {

    try {
        //DB query to retieve corresponding longlink
        const sql = 'SELECT long_link FROM links WHERE short_link = ?';
        let url = util.escapeParam(req.params.linkID);

        //query for shortlink match, returning shortlink
        con.query(sql, url, (err, rows) => {
            if(err) { //handle DB query error
                console.log(err);
                return res.status(500).send('Server Error: Bad Query');
            }
            if(!rows[0].hasOwnProperty('long_link')){ //check db response includes full link pair
                return res.status(404).send('Link Not Found');
            }
            url = util.unescapeParam(rows[0].long_link);
            res.redirect(url);
        });

    } catch (error) {
        console.log(error); //api error log
        return res.status(500).send('API Error'); //error response to client
    }
});

//generate unique shortlink
const generateShortLink = () => {
    let code = shortid.generate(); //initial code generation
    const retries = 5;  //retry limit

    //query for all shortlinks in DB
    let shortLinks = [];
    con.query('SELECT short_link FROM links', (err, rows) => {
        if(err) { //handle DB query error
            console.log(err);
            return res.status(500).send('Server Error: Bad Query');
        }
        rows.forEach((row) => { //store shortlinks in local array
            shortLinks.push(row.short_link);
        })
    });

    // loop over local array for set retry limit to generate unique code
    for (let i = 0; i < retries; i++) {
        const isDuplicateFound = shortLinks.find(link => link === code); //check db for duplicate
        if (!isDuplicateFound) {
            return code;
        }
        code = shortid.generate(); //regenerate code
    }
    throw 'failed to generate code'; //failed to generate unique code before limit reached.
}

app.listen(port);