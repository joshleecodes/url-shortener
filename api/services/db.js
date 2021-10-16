"use strict";
const mysql = require("mysql");

let isConnected = false;


const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});


const init = () => {
  con.connect((err) => {
    if (err) {
      console.log("Error connecting to Db");
      console.log(err);
      return;
    }
    console.log("DB Connection established");
    isConnected = true;
  });
  con.query("USE urlshortener");
};

const getConnection = () => {
  if (!isConnected) {
    return null;
  }
  return con;
};

module.exports = { init, getConnection };
