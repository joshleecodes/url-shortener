const express = require('express');
const { argv } = require('process');
const prompt = require('prompt');
prompt.start();

const app = express();
const port = process.env.PORT || 3000;
console.log(`default endpoint: localhost:${port}`);

//in memory db
const linkDB = [];

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

//generate unique code
const generateShortLink = () => {
    return linkDB.length + 1;
}

//default endpoint
app.get('/', (req, res) => {
    res.send('enter generated url into browser');
});

//get longlink from shortlink
app.get('/:shortlink', (req, res) => {
    const linkPair = linkDB.find(linkPair => linkPair.shortLink === parseInt(req.params.shortlink));
    if(!linkPair) return res.status(404).send('link not found.');
    res.redirect(linkPair.longLink);
});

//prompt user for link, store user input, generate shortlink
prompt.get(['url'], (err, result) => {
    let userLink = result.url;
    isValidLink(userLink);
    genLink = generateShortLink();
    const linkPair = {
        longLink: userLink,
        shortLink: genLink
    };
    linkDB.push(linkPair);
    console.log(`shortlink: localhost:${port}/${genLink}`);
});

app.listen(port);
