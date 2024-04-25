// db.js
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'admindb.cn8mq40os5m7.eu-north-1.rds.amazonaws.com',
  port: '3306',
  user: 'admin',
  password: 'mqsFL12AFnqT2gdnoFHi', 
  database: 'admindb',
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
