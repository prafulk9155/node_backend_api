const express = require('express');
const router = express.Router();
const connection = require('../connection');
 // Import the MySQL connection


  
// Add user API endpoint
router.post('/addProject', (req, res) => {
    const { project_name, desc, start_date, due_date, current_status, assigned_to, created_by, is_active } = req.body;
  
    const addProjectQuery = `INSERT INTO project_table (project_name, \`desc\`, created_on, start_date, due_date, current_status, assigned_to, created_by, is_active) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?)`;

  
    connection.query(addProjectQuery, [project_name, desc, start_date, due_date, current_status, assigned_to, created_by, is_active], (error, results) => {
      if (error) {
        console.error('Error adding project:', error);
        res.status(500).json({ error: 'Failed to add project' });
      } else {
        console.log('Project added successfully');
        res.status(200).json({ message: 'Project added successfully' });
      }
    });
  });
  
  
  


  
  

module.exports = router;
