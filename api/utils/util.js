"use strict";
const axios = require("axios");


const createURLPair = (genLink, userLink) => {
  if(!genLink || !userLink) {
    return null;
  }  
  return {
    short_link: escape(genLink),
    long_link: escape(userLink),
  };
};


const validateLink = (url) => {
  try {
    new URL(url);
    return url;
  } catch (error) {
    throw "invalid url";
  }
};


const checkIfActive = (url) => {
  return axios
    .get(url)
    .then(() => {
      return "link created";
    })
    .catch(() => {
      return "Warning: link could be inactive";
    });
};

module.exports = { createURLPair, validateLink, checkIfActive };
