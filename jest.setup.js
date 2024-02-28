const express = require('express');
const mongoose = require('mongoose');
const app = express();

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  
  app.get('/', (req, res) => {
    res.json({ message: 'Hello, welcome to the test app' });
  });

  app.post('/takeLoan', (req, res) => {
    res.json({ message: 'Loan taken successfully'});
  });

  app.post('/submitInstallment', (req, res) => {
    res.json({ message: 'Installment submitted successfully'});
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
  });

module.exports = app;

