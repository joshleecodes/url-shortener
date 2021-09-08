const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


const port = process.env.PORT || 8080;
const siteDomain = 'localhost:8080/'
console.log(`default endpoint: localhost:${port}`);

//in memory db
const linkDB = [];

//create new short link
app.post('/create-link', (req, res) => {
    const userLink = req.body.userLink;
    // isValidLink(userLink);
    const genLink = `${generateShortLink()}`;
    const linkPair = {
        longLink: userLink,
        shortLink: genLink
    };
    linkDB.push(linkPair);
    res.send(`${siteDomain}${genLink}`);
});

//redirect from shortlink
app.get('/:linkID', (req, res) => {
    const linkPair = linkDB.find(linkPair => linkPair.shortLink === req.params.linkID);
    console.log('linkPair: ', linkPair);
    console.log('linkID: ', req.params.linkID);
    console.log('linkDB: ', linkDB);
    if(!linkPair) return res.status(404).send('link not found.');
    res.redirect(linkPair.longLink); 
});

//generate unique code
const generateShortLink = () => {
    return linkDB.length + 1;
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




app.listen(port);
