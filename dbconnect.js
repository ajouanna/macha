// encapsulate connection to mysql

var mysql  = require('mysql');
var conf = require("./config/setup");

var db = mysql.createConnection({
  host     : conf.host,
  user     : conf.user,
  password : conf.password,
  database : conf.database,
  port     : conf.port
});

module.exports = db;