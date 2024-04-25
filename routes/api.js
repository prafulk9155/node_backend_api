const express = require('express');
const router = express.Router();
const cors = require('cors');  

const connection = require('../connection'); 

const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
  service:'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: 'prafulk9155@gmail.com',
    pass: 'enekdqaxddsxsxar'
  },
});

router.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);


router.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected to Admin API' });

});


router.post('/getUrl', (req, res) => {
  // Retrieve data from the database table
  const getUserQuery = `SELECT * FROM url_list`;
  connection.query(getUserQuery, (error, results) => {
    if (error) {
      console.error('Error retrieving URL:', error);
      res.status(500).json({ error: 'Failed to get URL' });
      return;
    }

    // Respond with the retrieved user data
    res.status(200).json({ urlList: results });
  });
});



router.post('/sendAlert', (req, res) => {
  // Retrieve data from the database table
  const getUserQuery = `SELECT * FROM url_list`;
  connection.query(getUserQuery, (error, results) => {
    if (error) {
      console.error('Error retrieving URL:', error);
      res.status(500).json({ error: 'Failed to get URL' });
      return;
    }

 const inactiveURLs = results.filter(url => url.status === 'inactive');

 // Send email if inactive URLs are found
 if (inactiveURLs.length > 0) {
   const mailOptions = {
     from: 'prafulk9155@gmail.com',
     to: 'praful.kumar@oges.info',
     subject: 'Alert : Inactive Url',
     text: `The following URLs are inactive: ${JSON.stringify(inactiveURLs)}`
   };


   transporter.sendMail(mailOptions, (error, info) => {
     if (error) {
       console.error('Error sending email:', error);
       res.status(500).json({ error: 'Failed to send email' });
       return;
     }
     console.log('Email sent:', info.response);
   });
   
 }
 res.status(200).json({ urlList: results });
});
});


// Add user API endpoint
router.post('/addUrl', (req, res) => {
  const { title, url, status, user, pass } = req.body.data; // Extracting data from the request body
  // Assuming id is auto-incremented in the database table

  const addUserQuery = `INSERT INTO url_list (title, url, status, user, pass, last_login) VALUES (?, ?, ?, ?, ?, '')`;
  connection.query(addUserQuery, [title, url, status, user, pass], (error, results) => {
    if (error) {
      console.error('Error adding URL:', error);
      res.status(500).json({ error: 'Failed to add URL', error });
      return;
    }
    console.log('URL added successfully');
    res.status(200).json({ message: 'URL added successfully' });
  });
});








router.post('/getUrlDetail', (req, res) => {
  const { url_id } = req.body.data;
  const getUserQuery = `SELECT connectivity_speed AS ms, updated_on, url FROM url_connectivity_speed WHERE url_id = ?`;

  connection.query(getUserQuery, [url_id], (error, results) => {
    if (error) {
      console.error('Error retrieving URL details:', error);
      res.status(500).json({ error: 'Failed to get URL details' });
      return;
    }

    // Initialize arrays to store ms and updated_on values
    const msArray = [];
    const updatedOnArray = [];

    // Iterate through the results and populate the arrays
    results.forEach(row => {
      msArray.push(row.ms);
      updatedOnArray.push(row.updated_on);
    });

    // Create the urlDetails object with the rearranged arrays
    const urlDetails = {
      ms: msArray,
      updated_on: updatedOnArray,
      url_id: url_id,
      url: results.length > 0 ? results[0].url : '' // Assuming the URL is the same for all rows
    };

    // Respond with the rearranged URL details
    res.status(200).json({ urlDetails });
  });
});



router.post('/getActiveService', (req, res) => {
  // const { url_id } = req.body.data;
  const getUserQuery = `SELECT unit_name AS service, active, sub, description, last_updated  FROM service_status WHERE sub = 'running' ORDER BY last_updated DESC`;

  connection.query(getUserQuery, [], (error, results) => {
    if (error) {
      console.error('Error retrieving URL details:', error);
      res.status(500).json({ error: 'Failed to get Services details' });
      return;
    }

    // Respond with the rearranged URL details along with success true
    res.status(200).json({ success: true, serviceList: results });
  });
});

router.post('/getDeadService', (req, res) => {
  // const { url_id } = req.body.data;
  const getUserQuery = `SELECT unit_name AS service, active, sub,description, last_updated FROM service_status WHERE sub = 'dead' ORDER BY last_updated DESC`;

  connection.query(getUserQuery, [], (error, results) => {
    if (error) {
      console.error('Error retrieving URL details:', error);
      res.status(500).json({ error: 'Failed to get Services details' });
      return;
    }

    // Respond with the rearranged URL details along with success true
    res.status(200).json({ success: true, serviceList: results });
  });
});




router.post('/addRDP', (req, res) => {
  const { ip, user, os, ram, hdd, assigned_to, created_on, status } = req.body.data; // Extracting data from the request body

  const addUserQuery = `INSERT INTO rdp_list ( ip, user,config_os,config_ram,config_hdd,assigned_to,created_on,status) VALUES (?, ?, ?, ?, ?, ?,NOW(),'')`;
  connection.query(addUserQuery, [ip, user, os, ram, hdd, assigned_to, created_on, status], (error, results) => {
    if (error) {
      console.error('Error adding URL:', error);
      res.status(500).json({ success: false, error: 'Failed to add RDP', error });
      return;
    }
    console.log('RDP added successfully');
    res.status(200).json({ success: true, message: "RDP Added Succssfully" });
  });
});

router.post('/getRDPList', (req, res) => {
  // const {  } = req.body.data; // Extracting data from the request body

  const addUserQuery = `SELECT * from  rdp_list `;
  connection.query(addUserQuery, [], (error, results) => {
    if (error) {
      console.error('Error getting RDP:', error);
      res.status(500).json({ success: false, error: 'Failed to get RDP list', error });
      return;
    }

    res.status(200).json({ success: true, RDPList: results });
  });
});

router.post('/getDBStatus', (req, res) => {
  // const {  } = req.body.data; // Extracting data from the request body

  const addUserQuery = `SELECT db_name, MAX(updated_on) AS last_updated
  FROM db_backup_history
  GROUP BY db_name;
  `;
  connection.query(addUserQuery, [], (error, results) => {
    if (error) {
      console.error('Error getting DB:', error);
      res.status(500).json({ success: false, error: 'Failed to get DB list', error });
      return;
    }

    res.status(200).json({ success: true, DBList: results });
  });
});

router.get('/getUserTaskStatus', (req, res) => {
  const getUserStatusQuery = `SELECT ts.*, ul.userName AS Name FROM task_status ts LEFT JOIN userList ul ON ts.userid = ul.id`;
  connection.query(getUserStatusQuery, (error, results) => {
    if (error) {
      console.error('Error retrieving users:', error);
      res.status(500).json({ error: 'Failed to get users' });
      return;
    }
    // Respond with the retrieved user data including the user's name
    res.status(200).json({ UserTaskStatus: results });
  });
});

router.get('/getUserTaskStatusById/:id', (req, res) => {
  const userId = req.params.id;
  const getUserStatusQuery = `SELECT ts.*, ul.userName AS Name FROM task_status ts LEFT JOIN userList ul ON ts.userid = ul.id WHERE ts.userid = ${userId}`;
  connection.query(getUserStatusQuery, (error, results) => {
    if (error) {
      console.error('Error retrieving user task status:', error);
      res.status(500).json({ error: 'Failed to get user task status' });
      return;
    }
    // Respond with the retrieved user task status including the user's name
    res.status(200).json({ UserTaskStatus: results });
  });
});




module.exports = router;
