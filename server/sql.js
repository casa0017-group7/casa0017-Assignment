var mysql = require('mysql');
const {host, port, user, password, database} = require("./public/resources/secrets.js")

var db = mysql.createConnection({
    host: host,
    port: port,
    user: user,
    password: password,
    database: database,
});

db.connect();
module.exports = db;