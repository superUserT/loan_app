// loan.js
const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  outstandingBalance: Number,
  interestRate: Number,
  paymentPeriod: Number,
  payments: Array,
});

const Loan = mongoose.model('Loan', LoanSchema);

module.exports = Loan;
