// loanRoutes.js
const express = require('express');
const Loan = require('../models/loan');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello, welcome to the loan app');
});

// update this route so that it includes name of person who took the loan
// update this route so that user posts interest, payment period too
router.post('/takeLoan', async (req, res) => {
  try {
    const { name, loanAmount, interestRate, paymentPeriod } = req.body;

    // Validate parameters
    if (!name || !loanAmount || !interestRate || !paymentPeriod) {
      return res.status(400).json({ error: 'Invalid loan parameters' });
    }

    // Check if the user already has an outstanding loan
    const existingLoan = await Loan.findOne({ name, outstandingBalance: { $gt: 0 } });

    if (existingLoan) {
      return res.status(400).json({ error: 'User already has an outstanding loan balance' });
    }

    // Create a new loan
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

    // Validate parameters
    if (!name) {
      return res.status(400).json({ error: 'Loan taker name is required' });
    }

    // Find the user by name
    const userLoan = await Loan.findOne({ name });

    // Check if the user exists
    if (!userLoan) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the payments for the specific loan taker
    res.json({ payments: userLoan.payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/submitInstallment', async (req, res) => {
  try {
    const { name, installmentAmount } = req.body;

    // Validate parameters
    if (!name || !installmentAmount) {
      return res.status(400).json({ error: 'Both name and installmentAmount are required' });
    }

    // Find the user by name
    const userLoan = await Loan.findOne({ name });

    // Check if the user exists
    if (!userLoan) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's outstanding balance, interest, and principal
    const updatedBalance = userLoan.outstandingBalance - installmentAmount;
    const interestPaid = userLoan.interestPaid + (userLoan.interestRate / 12) * userLoan.outstandingBalance;
    const principalPaid = userLoan.principalPaid + installmentAmount;

    // Update the loan document
    userLoan.outstandingBalance = updatedBalance;
    userLoan.interestPaid = interestPaid;
    userLoan.principalPaid = principalPaid;
    userLoan.payments.push({
      installmentAmount,
      outstandingBalance: updatedBalance,
      interestPaid,
      principalPaid,
    });

    // Save the updated document
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
