// db.js
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '192.168.1.140',
  port: '3306',
  user: 'ogesone',
  password: 'My$ql@ogOne#123', 
  database: 'oges_sms',
  // host: 'localhost',
  // // host: '192.168.1.140',
  // port: '3306',
  // user: 'root',
  // password: '', 
  // database: 'oges_sms',
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });
  

module.exports = connection;
