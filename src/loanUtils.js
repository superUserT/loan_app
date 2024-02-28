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
  
  module.exports = { calculateMonthlyPayment, calculateTotalAmount, addMonthsToDate };
  