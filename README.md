project init


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


# submit installment
curl -X POST http://localhost:3000/submitInstallment -H "Content-Type: application/json" -d '{"installmentAmount": 5000}'

# view payments
curl http://localhost:3000/viewPayments


## verify database has loan amount taken
mongo
use loans
db.loans.find()

exit -> exit