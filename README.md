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



## Take loan

curl -X POST http://localhost:3000/takeLoan -H "Content-Type: application/json" -d '{"name": "Alex", "loanAmount": 5000, "interestRate": 10, "paymentPeriod": 18, "loanTakenDate": "2024-02-27"}'




## submit installment includes date.now

curl -X POST http://localhost:3000/submitInstallment -H "Content-Type: application/json" -d '{"name": "Alex", "installmentAmount": 500}'





## view customer payments


curl http://localhost:3000/viewPayments?name=Alex


## view payments table

curl http://localhost:3000/viewPaymentTable/Alex




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