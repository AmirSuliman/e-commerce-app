const express = require('express');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const route = require('./routes/user');
const bodyParser = require('body-parser');

dotEnv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Successfuly Connected to Mongodb..."))
  .catch(err => console.error('Could not connect to mongodb..',err.message));

const app = express();
app.use(express.json());

app.use('/api/users', route);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening at port: ${port}`));