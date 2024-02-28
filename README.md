# Loan Application: Reducing balance method

## Project Description

This project creates an express backend server that has 3 endpoints that return data responses in JSON
format to the requester:
1. An endpoint to allow a user to take a loan if they have no outstanding balance.
2. An endpoint to allow a user to view their payments, interest paid, principal paid so far, and
outstanding balances.
3. Allow a user to submit an instalment and receive a response with the amount paid, outstanding
balance, interest paid, and principal paid.


## project Structure
```
loan-app/
|-- node_modules/
|-- src/
|   |-- models/
|   |   |-- loan.js
|   |-- routes/
|   |   |-- loanRoutes.js
|   |   |-- loanUtils.js
|   |-- app.js
|-- tests/
|   |-- loanRoutes.test.js
|-- .gitignore
|-- jest.setup.js
|-- package-lock.json
|-- package.json
|-- README.md
```

## Dataflow

I have attached an image to show how the data flows in this application:

![loanApp Data Flow Diagram](LoanApp.jpg)


Admittedly I am a bit rusty when it comes to UML, but this should suffice.

### Diagram Summary

In the provided application, the flow of data involves handling loan-related operations through an Express.js application with MongoDB as the database. Here's a high-level overview of the data flow:

1. **Client Requests**: The flow begins when a client (e.g., a web browser or API client) sends HTTP requests to the Express.js server.

2. **Express.js Routes**: Express.js routes, defined in the `loanRoutes.js` file, handle incoming requests. These routes include:

   - `/`: Responds with a welcome message.
   - `/takeLoan`: Handles requests for taking a loan. Validates input, checks for an existing loan, and creates a new loan entry in the MongoDB database.
   - `/viewPayments`: Retrieves and returns payment information for a specific user.
   - `/submitInstallment`: Handles the submission of loan installments. Validates input, calculates loan details, and updates the user's loan record.
   - `/viewPaymentTable/:name`: Retrieves and returns a payment table for a specific user.

3. **MongoDB Operations**: The routes interact with the MongoDB database using Mongoose, a MongoDB object modeling tool for Node.js. MongoDB operations include:

   - Retrieving existing loans (`Loan.findOne`).
   - Creating new loan entries (`new Loan` and `save()`).
   - Updating existing loan records based on installment submissions.

4. **LoanUtils Module**: The application utilizes a `loanUtils.js` module that provides utility functions for loan calculations. These functions include calculating monthly payments, total amounts, and determining the cutoff date for loan payments.

5. **HTTP Responses**: Express.js sends appropriate HTTP responses back to the client, including success messages, error messages, and requested data.

6. **Error Handling**: The application includes error handling to manage situations such as invalid input, user not found, and internal server errors. Errors are appropriately logged, and corresponding HTTP status codes and error messages are returned to the client.

7. **Express Server**: The Express server listens for incoming requests on a specified port (`3000` in this case) and logs a message indicating that the server is running.

Overall, the data flow involves handling client requests, routing them through Express.js, interacting with MongoDB for data storage and retrieval, performing loan calculations using utility functions, and responding to clients with appropriate HTTP responses.


## Installation Instructions

First clone the project into your pc my using the following command in your command terminal of choice:

```
git clone https://github.com/superUserT/loan_app.git
```

Ensure you have installed node before you use npm to install the project dependancies.you can find the link 
to the npm installation [here](https://nodejs.org/en/download)

Then, once the cloning is done ensure that you install the package.json to install all the project dependancies.Use the following command in your terminal:

```
npm install
```

Additionally, this project uses mongodb in order to save json objects into a local storage, so follow the instructions on this [page](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/) to download mongodb. For this project I am using WSL and I am currently running Ubuntu 20.04. I installed mongo using the linux package manager. 

```
sudo apt-get install -y mongodb-org
```

## How to run the project

Since the project uses a local instance of mongo, you have to initialise mongo, create the database then run the project.

### Intialise mongo

On one terminal window enter:

```
mongod
```

### Create the database

I have chosen to name my database loans so do the following in order to use it.
On another window, while the other window is still running:

```
mongo
```

The previous command should let you run database commands, you should see an arrow like ">" indicating you are in the mongo terminal.Enter:

```
use loans
```
then you can exit the database with:

```
exit
```


## Run instructions

On yet another terminal window, enter:

```
node src/app.js
```

this will run the app and you should recieve:

```
Server is running on http://localhost:3000
```

Ensure that your ufw firewalls have been configiured to allow you to use port 3000 and port 27017 for the database.


### Taking loans: Endpoint 1

For this implementation I have not implemented a frontend yet, so I will be using curl to interact with the server. In order for the user to take a loan the user has to enter a string anem and a few parameters. see below:

```
curl -X POST http://localhost:3000/takeLoan -H "Content-Type: application/json" -d '{"name": "Alex", "loanAmount": 5000, "interestRate": 10, "paymentPeriod": 18, "loanTakenDate": "2024-02-27"}'
```


### submit installments: Endpoint 2

Simmilarly in order to submit and istallment, one can use the following structure to submit a loan through the submitInstallment endpoint.

```
curl -X POST http://localhost:3000/submitInstallment -H "Content-Type: application/json" -d '{"name": "Alex", "installmentAmount": 500}'
```

### view customer payments: endpoint 3

The user can see payments they have made by using their name as a parameter.

```
curl http://localhost:3000/viewPayments?name=Alex
```

or entering this into a browser while the server is running in order to get a tabulated response:

```
http://localhost:3000/viewPayments?name=Alex
```

Another endpoint for viewing installments and their respective payments is:


```
curl http://localhost:3000/viewPaymentTable/Alex
```

or simply pasting the following into the browser while the server is running.

```
http://localhost:3000/viewPaymentTable/Alex
```


### Database Save

you can also verify that the json objects are being stored in the database by using the following command in your mongo terminal:

```
mongo
```

then:

```
use loans
```

then finally:

```
db.loans.find()
```


## Running tests

I have used jest to test that the endpoints are working, admitedlly I do not have 100% test coverage.

In order to run the tests use: 

```
npm test
```