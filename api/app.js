const express = require('express');
const cors = require('cors');
const shortid = require('shortid');
const axios = require('axios');

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

        const info = await checkIfActive(userLink);
        const genLink = generateShortLink();
        const linkPair = {
            longLink: userLink,
            shortLink: genLink
        };
        linkDB.push(linkPair);
        res.status(200).json({ result: `${siteDomain}${genLink}` });
    } catch (error) {
        console.log('error: ', error);
        res.status(400).json({ error })
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

    // if we ever end up here, its an arry
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
        .then(response => {
            if (response.ok) {
                return true;
            }
            return false;
        });
}

app.listen(port);