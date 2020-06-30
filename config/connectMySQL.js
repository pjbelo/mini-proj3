const mysql = require("mysql");
module.exports = {
  con: mysql.createConnection({
    host: "zpfp07ebhm2zgmrm.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "wa4katvxw5sg00gl",
    password: process.env.DBPASS,
    database: "iwp1vd0b9x4ja6z5",
  }),
};
