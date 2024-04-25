const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const addApiRoutes = require('./routes/project_api')
const cors = require('cors');




const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
// Middleware
app.use(bodyParser.json());

// API routes
app.use('/api', apiRoutes);
app.use('/addapi', addApiRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
