var mysql = require("mysql2");

module.exports = function(){
 return mysql.createConnection({
  host: "dpg-cktfaneb0mos73ept8mg-a",
    user: "starlight_user",
    password: "y5SwiPkE70qrECjDxVDMf37rh2SzlH4b",
    database: "starlight",
    port: 5432  
  });
}