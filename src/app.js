const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const loanRoutes = require('./routes/loanRoutes');

require('@sinonjs/commons');

const app = express();
const PORT = 3000;

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/loans', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());


app.use('/', loanRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
