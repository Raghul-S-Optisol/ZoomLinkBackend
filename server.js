const express = require('express')
const cors = require('cors')

const routers = require('./Routes/routers')

const dotenv = require('dotenv'); // Import dotenv
dotenv.config(); // Load environment variables

const app = express();
app.use(express.json())
app.use(cors());


app.use('/',routers)

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


module.exports = app;
