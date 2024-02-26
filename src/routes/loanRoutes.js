const express = require('express');
const Loan = require('../models/loan');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello, welcome to the loan app');
});


router.post('/takeLoan', async (req, res) => {
  try {
    const { name, loanAmount, interestRate, paymentPeriod } = req.body;

    if (!name || !loanAmount || !interestRate || !paymentPeriod) {
      return res.status(400).json({ error: 'Invalid loan parameters' });
    }

    const existingLoan = await Loan.findOne({ name, outstandingBalance: { $gt: 0 } });

    if (existingLoan) {
      return res.status(400).json({ error: 'User already has an outstanding loan balance' });
    }

    const newLoan = new Loan({
      name,
      outstandingBalance: loanAmount,
      interestRate,
      paymentPeriod,
      payments: [],
    });

    await newLoan.save();
    res.json({ message: 'Loan taken successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/viewPayments', async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: 'Loan taker name is required' });
    }

    const userLoan = await Loan.findOne({ name });

    if (!userLoan) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ payments: userLoan.payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/submitInstallment', async (req, res) => {
  try {
    const { name, installmentAmount } = req.body;

    if (!name || !installmentAmount) {
      return res.status(400).json({ error: 'Both name and installmentAmount are required' });
    }

    const userLoan = await Loan.findOne({ name });


    if (!userLoan) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedBalance = userLoan.outstandingBalance - installmentAmount;
    const interestPaid = userLoan.interestPaid + (userLoan.interestRate / 12) * userLoan.outstandingBalance;
    const principalPaid = userLoan.principalPaid + installmentAmount;

    
    userLoan.outstandingBalance = updatedBalance;
    userLoan.interestPaid = interestPaid;
    userLoan.principalPaid = principalPaid;
    userLoan.payments.push({
      installmentAmount,
      outstandingBalance: updatedBalance,
      interestPaid,
      principalPaid,
    });

    await userLoan.save();

    res.json({
      message: 'Installment submitted successfully',
      installmentAmount,
      outstandingBalance: updatedBalance,
      interestPaid,
      principalPaid,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
