const nodemailer = require('nodemailer');

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  // Your email configuration
  service: 'gmail',
  auth: {
    user: 'prafulk7050@gmail.com',
    pass: 'Complex@123#456'
  }
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

    // Filter inactive URLs
    const inactiveURLs = results.filter(url => url.status === 'active');

    // Send email if inactive URLs are found
    if (inactiveURLs.length > 0) {
      const mailOptions = {
        from: 'prafulk9155@gmail.com',
        to: 'prafulk7050@gmail.com',
        subject: 'Inactive URLs',
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

    // Respond with the retrieved user data
    res.status(200).json({ urlList: results });
  });
});
