const request = require('supertest');
const app = require('../src/app');
const loanUtils = require('../loanUtils');

jest.mock('../src/loanUtils');

describe('Loan Routes', () => {
  it('should return welcome message for / endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello, welcome to the loan app' });
  });


  it('should take a loan successfully', async () => {
    const response = await request(app)
      .post('/takeLoan')
      .send({
        name: 'John',
        loanAmount: 5000,
        interestRate: 0.1,
        paymentPeriod: 18,
        loanTakenDate: '2024-02-27',
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Loan taken successfully' });
  });

  
  it('should submit installment successfully', async () => {
    loanUtils.calculateMonthlyPayment.mockReturnValue(200); 
    loanUtils.calculateTotalAmount.mockReturnValue(2400);

    const response = await request(app)
      .post('/submitInstallment')
      .send({
        name: 'John',
        installmentAmount: 400,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Installment submitted successfully');
    expect(response.body.installmentAmount).toBe(400);
  });
 
  
  it('should return payment table for a user', async () => {
    const response = await request(app).get('/viewPaymentTable/John');
    expect(response.status).toBe(200);
    expect(response.body.paymentsTable).toHaveLength(1); 
  });
});

