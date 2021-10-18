"use strict";
const util = require("../utils/util");
const shortid = require("shortid");
const db = require("../services/db");

const siteDomain = "localhost:8080/";


const isUniqueCode = (code) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT short_link FROM links WHERE short_link = ?";

    db.getConnection().query(sql, code, (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      if (!rows.length) {
        resolve(true);
      }

      resolve(false);
    });
  });
};

const generateShortLink = async () => {
  let code = shortid.generate();
  const retries = 5;
  
  const isUnique = await isUniqueCode(code);
  if (isUnique) {
    return code;
  }

  for (let i = 0; i < retries; i++) {
    code = shortid.generate();
    const isUnique = await isUniqueCode(code);
    if (isUnique) {
      return code;
    }
  }
  throw "failed to generate code";
};

const createLinkController = async (req, res) => {
  const userLink = req.body.userLink;

  try {
    util.validateLink(userLink);
    const feedback = await util.checkIfActive(userLink);

    const genLink = await generateShortLink();

    const sql = "INSERT INTO links SET ?";
    let values = util.createURLPair(genLink, userLink);
    db.getConnection().query(sql, values, (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Server Error: Bad Query");
      } else
        res.status(200).json({ result: `${siteDomain}${genLink}`, feedback });
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({ error });
  }
};

const redirectLinkController = (req, res) => {
  try {
    const sql = "SELECT long_link FROM links WHERE short_link = ?";
    let url = escape(req.params.linkID);

    db.getConnection().query(sql, url, (err, rows) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Server Error: Bad Query");
      }
      if (!rows[0].hasOwnProperty("long_link")) {
        return res.status(404).send("Link Not Found");
      }
      url = unescape(rows[0].long_link);
      res.redirect(url);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("API Error");
  }
};

module.exports = { createLinkController, redirectLinkController };
