const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv= require('dotenv')
dotenv.config();

const app = express();
const port =  5000;

app.use(cors());
app.use(express.json());


// MONGODB ATLAS CONNECTION

mongoose.connect(process.env.MONGO, function(err, client) {
  if (err) {
    console.error('Failed to connect to the database. Error:', err);
  } else {
    console.log('Connected successfully to server');
    // Your database interaction code here
    client.close();
  }
});
// ROUTES
const userRouter = require("./routes/api/user");
const dishRouter = require("./routes/api/dish");
const orderRouter = require("./routes/api/order");
app.use('/user', userRouter);
app.use('/dish', dishRouter);
app.use('/order', orderRouter);


app.listen(port, () => {
  console.log("Server is running on port:" + port);
});
