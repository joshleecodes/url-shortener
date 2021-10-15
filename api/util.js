const axios = require('axios');

module.exports = {
    //create url pair from user provided link(longlink) and generated code link(shortlink)
    createURLPair(genLink, userLink) {
        return {
            short_link: this.escapeParam(genLink),
            long_link: this.escapeParam(userLink)
        };
    },

    //checks user provided link is valid via node.js URL object creation
    validateLink(url) {
        try {
            new URL(url);
        } catch (error) {
            throw 'invalid url';
        }
    },

    //checks user provided link is active by making get request to see if a response is recieved
    checkIfActive(url) {
        return axios.get(url)
            .then( () => {
                return "link created";
            })
            .catch( () => {
                return "Warning: link could be inactive";
            });
    },

    //recieves a parameter string and returns an escaped string
    escapeParam(param) {
        return escape(param);
    },
    
    //recieves escaped string and returns the original/unescaped string
    unescapeParam(param) {
        return unescape(param);
    }
}