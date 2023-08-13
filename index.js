const express = require('express');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const userRoute = require('./routes/user');
const productRoute = require('./routes/product');
const authRoute = require('./routes/auth');

dotEnv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Successfuly Connected to Mongodb..."))
  .catch(err => console.error('Could not connect to mongodb..', err.message));

const app = express();
app.use(express.json());

app.use('/api/users', userRoute);
app.use('/api/users', authRoute);
app.use('/api/products', productRoute);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening at port: ${port}`));