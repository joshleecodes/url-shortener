const express = require('express');
const https = require('https')
const cors = require('cors');
const shortid = require('shortid');

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8080;
const siteDomain = 'localhost:8080/'
console.log(`default endpoint: localhost:${port}`);

//in memory db
const linkDB = [];

//handle create new short link
app.post('/create-link', (req, res) => {
    const userLink = req.body.userLink;
    if(isValidLink(userLink)){
        console.log(isActiveLink(userLink)); 
        const genLink = `${generateShortLink()}`;
        const linkPair = {
        longLink: userLink,
        shortLink: genLink
    };
    linkDB.push(linkPair);
    res.send(`${siteDomain}${genLink}`);
    }
    else res.send('not a url');
});

//handle redirect from shortlink
app.get('/:linkID', (req, res) => {
    const linkPair = linkDB.find(linkPair => linkPair.shortLink === req.params.linkID);
    if(!linkPair) return res.status(404).send('link not found.');
    res.redirect(linkPair.longLink);
});

//generate unique code
const generateShortLink = () => {
    let code = shortid.generate();
    const retries = 5;
    for(let i=0; i<retries; i++) {
        const duplicateFound = linkDB.find(linkPair => linkPair.shortLink === code); //check db for duplicate
        if(duplicateFound) code = shortid.generate(); //if exists generate another code
        else if (duplicateFound && i == retries-1) return "error"; //max iterations found - return error
        else return code; //return unique code
    }
}

//urlValidation
const isValidLink = (url) => {
    try {
        new URL(url);
        return true;
    } catch (err) {
        console.log('invalid url provided');
        return false;
    }
}

const isActiveLink = (url) => {
    const testURL = new URL(url);
    try {
        https.get(testURL, (res)
            //check status code
            // if 200 return true
            // else return false
        );
    }
    catch (err) {
        feedbackMessage = "Active link check failed";
        return feedbackMessage;
    }   
}

app.listen(port);