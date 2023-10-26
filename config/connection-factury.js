var mysql = require("mysql");

module.exports = function(){
 return mysql.createConnection({
    host: "0.0.0.0",
    port: 3333
  });
}