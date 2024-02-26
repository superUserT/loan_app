// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const loanRoutes = require('./routes/loanRoutes');

require('@sinonjs/commons');

const app = express();
const PORT = 3000;

mongoose.set('strictQuery', false);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/loans', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Middleware
// app.use(bodyParser.json());

app.use(express.json());

// Routes
app.use('/', loanRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
