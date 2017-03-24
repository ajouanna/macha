// encapsulate connection to mysql

var mysql  = require('mysql');
var conf = require("./config/setup");

var db = mysql.createConnection({
  host     : conf.mysql.host,
  user     : conf.mysql.user,
  password : conf.mysql.password,
  database : conf.mysql.database,
  port     : conf.mysql.port
});

module.exports = db;