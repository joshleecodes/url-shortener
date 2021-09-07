const express = require('express');
const cors = require('cors');
const { argv } = require('process');
const prompt = require('prompt');
prompt.start();
const testAPIRouter = require('./testAPI');

const app = express();
const port = process.env.PORT || 8080;
const siteDomain = 'localhost:3000/'
console.log(`default endpoint: localhost:${port}`);

app.use(cors());

//test routing
app.use("/testAPI", testAPIRouter);

//in memory db
const linkDB = [];

app.get('/user-link/:userLink', (req, res) => {
    console.log(req.params);
    let userLink = req.params;
    // isValidLink(userLink);
    genLink = `${siteDomain}${generateShortLink()}`;
    const linkPair = {
        longLink: userLink,
        shortLink: genLink
    };
    linkDB.push(linkPair);
    res.send(genLink);
});


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
    return (linkDB.length + 1).toString();
}

//get longlink from shortlink
// app.get('/:shortlink', (req, res) => {
//     const linkPair = linkDB.find(linkPair => linkPair.shortLink === parseInt(req.params.shortlink));
//     if(!linkPair) return res.status(404).send('link not found.');
//     res.redirect(linkPair.longLink); 
// });


app.listen(port);
