const request = require('supertest');
const app = require('../jest.setup');

jest.mock('../src/loanUtils');

describe('Loan Routes', () => {
  it('should return welcome message for / endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello, welcome to the test app' }); 
  });

  it('should take a loan successfully', async () => {
    const response = await request(app)
      .post('/takeLoan')
      .send({
        name: 'John',
        loanAmount: 5000,
        interestRate: 10,
        paymentPeriod: 18,
        loanTakenDate: '2024-02-27',
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Loan taken successfully' });
  });

  it('should submit installment successfully', async () => {
    require('../src/loanUtils').calculateMonthlyPayment.mockReturnValue(200);
    require('../src/loanUtils').calculateTotalAmount.mockReturnValue(2400);

    const response = await request(app)
      .post('/submitInstallment')
      .send({
        name: 'John',
        installmentAmount: 400,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Installment submitted successfully');
  });
});