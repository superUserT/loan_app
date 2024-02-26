// loanRoutes.js
const express = require('express');
const Loan = require('../models/loan');

const router = express.Router();

router.post('/takeLoan', async (req, res) => {
  try {
    const existingLoan = await Loan.findOne();
    if (existingLoan && existingLoan.outstandingBalance > 0) {
      return res.status(400).json({ error: 'User has an outstanding loan balance' });
    }

    const loanAmount = req.body.loanAmount;
    if (!loanAmount || isNaN(loanAmount) || loanAmount <= 0) {
      return res.status(400).json({ error: 'Invalid loan amount' });
    }

    const newLoan = new Loan({
      outstandingBalance: loanAmount,
      interestRate: 0.1,
      paymentPeriod: 18,
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
    const loan = await Loan.findOne();
    if (!loan) {
      return res.status(404).json({ error: 'No loan found' });
    }

    res.json(loan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/submitInstallment', async (req, res) => {
  try {
    const installmentAmount = req.body.installmentAmount;
    if (!installmentAmount || isNaN(installmentAmount) || installmentAmount <= 0) {
      return res.status(400).json({ error: 'Invalid installment amount' });
    }

    const loan = await Loan.findOne();
    if (!loan || loan.outstandingBalance <= 0) {
      return res.status(400).json({ error: 'No outstanding balance to pay' });
    }

    const interestComponent = loan.outstandingBalance * loan.interestRate;
    const principalComponent = installmentAmount - interestComponent;

    loan.outstandingBalance -= principalComponent;
    loan.payments.push({
      amountPaid: installmentAmount,
      outstandingBalance: loan.outstandingBalance,
      interestPaid: interestComponent,
      principalPaid: principalComponent,
    });

    await loan.save();

    res.json({
      amountPaid: installmentAmount,
      outstandingBalance: loan.outstandingBalance,
      interestPaid: interestComponent,
      principalPaid: principalComponent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
