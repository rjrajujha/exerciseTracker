const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const usersRoute = require('./routes/users');


// Database connection
const dburl = process.env.MONGO_URI;
mongoose.connect(dburl, (err) => {
  if (err) {
    console.log('Error connecting to database:' + err);
  }
  console.log('Connected to database');
});

// Routes
app.use("/api/users", usersRoute);

app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
