const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  outstandingBalance: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  paymentPeriod: { type: Number, required: true },
  loanTakenDate: { type: Date, required: true },
  cumulativeInstallments: { type: Number, default: 0 },
  payments: { type: Array, default: [] },
});

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
