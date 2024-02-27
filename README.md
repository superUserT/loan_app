Will update this post the frontend, bear with me

loan-app/
|-- node_modules/
|-- src/
|   |-- models/
|   |   |-- loan.js
|   |-- routes/
|   |   |-- loanRoutes.js
|   |-- app.js
|-- .gitignore
|-- package.json
|-- README.md



# take loan
curl -X POST http://localhost:3000/takeLoan -H "Content-Type: application/json" -d '{"loanAmount": 5000}'


## new curl command to take a loan
curl -X POST http://localhost:3000/takeLoan -H "Content-Type: application/json" -d '{"name": "John", "loanAmount": 5000, "interestRate": 0.1, "paymentPeriod": 18}'


## new curl command to take loan, include name of lender


curl -X POST http://localhost:3000/takeLoan -H "Content-Type: application/json" -d '{"name": "Thabo", "loanAmount": 3000, "interestRate": 0.4, "paymentPeriod": 18}'



## new curl command to take loan, include the loan date

curl -X POST http://localhost:3000/takeLoan -H "Content-Type: application/json" -d '{"name": "Abdul", "loanAmount": 5000, "interestRate": 0.1, "paymentPeriod": 18, "loanTakenDate": "2024-02-27"}'





## submit installment
curl -X POST http://localhost:3000/submitInstallment -H "Content-Type: application/json" -d '{"installmentAmount": 500}'

## new submit istallment 

curl -X POST http://localhost:3000/submitInstallment -H "Content-Type: application/json" -d '{"name": "John", "installmentAmount": 200}'

## submit installment includes date.now

curl -X POST http://localhost:3000/submitInstallment -H "Content-Type: application/json" -d '{"name": "Abdul", "installmentAmount": 500}'


## view payments
curl http://localhost:3000/viewPayments


## new view payments

curl http://localhost:3000/viewPayments?name=John


curl http://localhost:3000/viewPayments?name=Abdul





## verify database has loan amount taken
*run mongod

mongo
use loans
db.loans.find()

exit -> exit


## delete loans database
*run mongod
mongo
use admin
db.getSiblingDB('loans').dropDatabase()
exit