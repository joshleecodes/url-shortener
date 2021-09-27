const express = require('express');
const cors = require('cors');
const shortid = require('shortid');
const axios = require('axios');
const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password'
});
con.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      console.log(err);
      return;
    }
    console.log('Connection established');
});
con.query('USE urlshortener');


const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8080;
const siteDomain = 'localhost:8080/'
console.log(`default endpoint: localhost:${port}`);


//handle redirect from shortlink
app.get('/:linkID', async (req, res) => {

    //query for shortlink match, returning shortlink
    await con.query('SELECT long_link FROM links WHERE short_link = ?', req.params.linkID,  (err, rows) => {
        //check if link exists before redirect
        try {
            if(rows[0].hasOwnProperty('long_link')){
                res.redirect(rows[0].long_link);
            }
        } catch (error) {
            return res.status(404).send('link not found.')
        }
    });
});

//handle create new link request
app.post('/create-link', async (req, res) => {
    const userLink = req.body.userLink;
    
    try {
        validateLink(userLink);
        const feedback = await checkIfActive(userLink);
        console.log(feedback);
        const genLink = generateShortLink();
        const values = {
            short_link: genLink,
            long_link: userLink
        };
        con.query('INSERT INTO links SET ?', values, (err,res) => {
            if(err) throw err;
        });
        res.status(200).json({ result: `${siteDomain}${genLink}`, feedback });
    } catch (error) {
        console.log('error: ', error);
        res.status(400).json({ error });
    }
});

//generate unique code
const generateShortLink = () => {
    let code = shortid.generate();
    const retries = 5;
    let shortLinks = [];

    //query for all shortlinks in DB and store in array
    con.query('SELECT short_link FROM links', (err, rows) => {
        if(err) throw err;

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

    throw new Error('failed to generate code');
}

const validateLink = (url) => {
    try {
        new URL(url);
    } catch (error) {
        throw 'invalid url';
    }
}

const checkIfActive = (url) => {
    return axios.get(url)
        .then( () => {
            return "link created";
        })
        .catch( () => {
            return "Warning: link could be inactive";
        });
}

app.listen(port);