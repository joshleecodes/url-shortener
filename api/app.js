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

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8080;
const siteDomain = 'localhost:8080/'
console.log(`default endpoint: localhost:${port}`);

//in memory db
const linkDB = [];

//handle redirect from shortlink
app.get('/:linkID', (req, res) => {
    const linkPair = linkDB.find(linkPair => linkPair.shortLink === req.params.linkID);
    if(!linkPair) return res.status(404).send('link not found.');
    res.redirect(linkPair.longLink);
});

//handle create new link request
app.post('/create-link', async (req, res) => {
    const userLink = req.body.userLink;
    
    try {
        validateLink(userLink);
        const feedback = await checkIfActive(userLink);
        console.log(feedback);
        const genLink = generateShortLink();
        const linkPair = {
            longLink: userLink,
            shortLink: genLink
        };
        linkDB.push(linkPair);
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
    
    // loop over for n retries to generate code
    for (let i = 0; i < retries; i++) {
        const isDuplicateFound = linkDB.find(linkPair => linkPair.shortLink === code); //check db for duplicate
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