const express = require('express');
const Loan = require('../models/loan');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello, welcome to the loan app');
});


router.post('/takeLoan', async (req, res) => {
  try {
    const { name, loanAmount, interestRate, paymentPeriod, loanTakenDate } = req.body;

    if (!name || !loanAmount || !interestRate || !paymentPeriod || !loanTakenDate) {
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
      loanTakenDate: new Date(loanTakenDate),
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



function monthsToYears(months) {
  years = (months / 12);

  yearsRounded = years.toFixed(1);

  return yearsRounded;
}


// Function to calculate monthly payment using PMT formula
function calculateMonthlyPayment(Pv, APR, years) {
  const R = (APR / 100) / 12;
  const n = years * 12;
  const monthlyPayment = (Pv * R) / (1 - Math.pow(1 + R, -n));

  return monthlyPayment;
}


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

    // Calculate monthly payment using PMT formula
    const monthlyPayment = calculateMonthlyPayment(userLoan.outstandingBalance, userLoan.interestRate * 100, monthsToYears(userLoan.paymentPeriod));

    // Outstanding amount is total amount - installments
    const totalAmount = (monthlyPayment * 12).toFixed(2);

    // Update outstanding balance, interest paid, and principal paid based on the monthly payment
    const updatedBalance = (userLoan.outstandingBalance - installmentAmount).toFixed(2);
    const amountWithInterest = (totalAmount - installmentAmount).toFixed(2);
    const principalPaid = (userLoan.outstandingBalance - updatedBalance).toFixed(2);

    userLoan.outstandingBalance = parseFloat(updatedBalance);

    userLoan.principalPaid += parseFloat(principalPaid);

    // Add installment details to the payments array with the current date
    userLoan.payments.push({
      installmentAmount: parseFloat(installmentAmount),
      amountWithInterest: parseFloat(amountWithInterest),
      outstandingBalance: parseFloat(updatedBalance),
      principalPaid: parseFloat(principalPaid),
      installmentPaymentDate: new Date(),
    });

    await userLoan.save();

    res.json({
      message: 'Installment submitted successfully',
      installmentAmount: parseFloat(installmentAmount),
      amountWithInterest: parseFloat(amountWithInterest),
      outstandingBalance: parseFloat(updatedBalance),
      principalPaid: parseFloat(principalPaid),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
