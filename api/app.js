const express = require('express');
const cors = require('cors');
const shortid = require('shortid');
const axios = require('axios');
const mysql = require('mysql');

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

//initiating DB connection with feedback
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
        validateLink(userLink);
        const feedback = await checkIfActive(userLink);

        const genLink = generateShortLink(); //create unique shortlink
        
        //DB query to create new entry,
        const sql = 'INSERT INTO links SET ?';
        let values = createURLPair(genLink, userLink);
        con.query(sql, values, (err) => {
            if(err) {
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
        let url = escapeParam(req.params.linkID);

        //query for shortlink match, returning shortlink
        con.query(sql, url, (err, rows) => {
            if(err) {
                console.log(err);
                return res.status(500).send('Server Error: Bad Query');
            }
            if(!rows[0].hasOwnProperty('long_link')){ //check db response includes full link pair
                return res.status(404).send('Link Not Found');
            }
            url = unescapeParam(rows[0].long_link);
            res.redirect(url);
        });

    } catch (error) {
        console.log(error);
    }
});



///////////////////// API Assist functions

//generate unique shortlink
const generateShortLink = () => {
    let code = shortid.generate(); //initial code generation
    const retries = 5;  //retry limit

    //query for all shortlinks in DB and store in array
    let shortLinks = [];
    con.query('SELECT short_link FROM links', (err, rows) => {
        if(err) {
            console.log(err);
            return res.status(500).send('Server Error: Bad Query');
        }
        rows.forEach((row) => {
            shortLinks.push(row.short_link);
        })
    });

    // loop over for n retries to generate code
    for (let i = 0; i < retries; i++) {
        const isDuplicateFound = shortLinks.find(link => link === code); //check db for duplicate
        if (!isDuplicateFound) {
            return code;
        }
        code = shortid.generate();
    }
    throw 'failed to generate code';
}

//create url pair from user provided link(longlink) and generated code link(shortlink)
const createURLPair = (genLink, userLink) => {
    return {
        short_link: escapeParam(genLink),
        long_link: escapeParam(userLink)
    };
}



///////////////////// API URL Validation

//checks user provided link is valid via node.js URL object creation
const validateLink = (url) => {
    try {
        new URL(url);
    } catch (error) {
        throw 'invalid url';
    }
}

//checks user provided link is active by making get request to see if a response is recieved
const checkIfActive = (url) => {
    return axios.get(url)
        .then( () => {
            return "link created";
        })
        .catch( () => {
            return "Warning: link could be inactive";
        });
}



///////////////////// API UTIL

//recieves a parameter string and returns an escaped string
const escapeParam = (param) => {
    return escape(param);
}

//recieves escaped string and returns the original/unescaped string
const unescapeParam = (param) => {
    return unescape(param);
}

app.listen(port);