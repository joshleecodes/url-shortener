const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8080;
const siteDomain = 'localhost:3000/'
console.log(`default endpoint: localhost:${port}`);

//in memory db
const linkDB = [];

app.post('/create-link', (req, res) => {
    const userLink = req.body.userLink;
    // isValidLink(userLink);
    const genLink = `${siteDomain}${generateShortLink()}`;
    const linkPair = {
        longLink: userLink,
        shortLink: genLink
    };
    linkDB.push(linkPair);
    res.send(genLink);
});


//generate unique code
const generateShortLink = () => {
    return (linkDB.length + 1).toString();
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

//get longlink from shortlink
// app.get('/:shortlink', (req, res) => {
//     const linkPair = linkDB.find(linkPair => linkPair.shortLink === parseInt(req.params.shortlink));
//     if(!linkPair) return res.status(404).send('link not found.');
//     res.redirect(linkPair.longLink); 
// });


app.listen(port);
