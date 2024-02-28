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


function calculateMonthlyPayment(interestRate, paymentPeriods, presentValue) {
  let monthlyRate = interestRate / 12 / 100;
  let monthlyPayment = presentValue * monthlyRate / (1 - Math.pow(1 + monthlyRate, -paymentPeriods));

  return monthlyPayment;
}

function calculateTotalAmount(monthlyAmount, paymentPeriods) {
  let totalAmount = monthlyAmount * paymentPeriods;

  return totalAmount;
}


function addMonthsToDate(inputDate, monthsToAdd) {
  const date = new Date(inputDate);
  date.setMonth(date.getMonth() + monthsToAdd);
  const formattedDate = date.toISOString().split('T')[0];
  return formattedDate;
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

    const currentDate = new Date();
    const loanCutoffDate = addMonthsToDate(userLoan.loanTakenDate, userLoan.paymentPeriod);
    
    if (currentDate > loanCutoffDate) {
      return res.status(400).json({ error: 'Loan payment period has ended' });
    }

    const monthlyPayment = calculateMonthlyPayment(userLoan.interestRate, userLoan.paymentPeriod, userLoan.outstandingBalance);
    const totalAmount = calculateTotalAmount(monthlyPayment, userLoan.paymentPeriod);

    const updatedBalance = (userLoan.outstandingBalance - installmentAmount).toFixed(2);
    const amountWithInterest = (totalAmount - installmentAmount).toFixed(2);


    userLoan.cumulativeInstallments += parseFloat(installmentAmount);
    userLoan.outstandingBalance = parseFloat(updatedBalance);


    userLoan.payments.push({
      installmentAmount: parseFloat(installmentAmount),
      amountWithInterest: parseFloat(amountWithInterest),
      outstandingBalance: parseFloat(updatedBalance),
      installmentPaymentDate: new Date(),
    });

    await userLoan.save();

    res.json({
      message: 'Installment submitted successfully',
      installmentAmount: parseFloat(installmentAmount),
      amountWithInterest: parseFloat(amountWithInterest),
      outstandingBalance: parseFloat(updatedBalance),
      cumulativeInstallments: parseFloat(userLoan.cumulativeInstallments),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/viewPaymentTable/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const userLoan = await Loan.findOne({ name });

    if (!userLoan) {
      return res.status(404).json({ error: 'User not found' });
    }

    const paymentsTable = userLoan.payments.map(payment => ({
      Installment_Amount: payment.installmentAmount,
      Amount_With_Interest: payment.amountWithInterest,
      Outstanding_Balance: payment.outstandingBalance,
      Principal_Paid: payment.principalPaid,
      Interest_Paid: payment.interestPaid,
      Installment_Payment_Date: payment.installmentPaymentDate.toISOString().split('T')[0],  // Format date as YYYY-MM-DD
    }));

    res.json({ paymentsTable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;