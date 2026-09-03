const transactionService = require('./TransactionService');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');
const fetch = require('node-fetch');
const moment = require('moment');

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();

// ROUTES FOR OUR API
// =======================================================

// Health Checking
router.get('/health', (req, res) => {
    res.json("This is the health check");
});

// ADD TRANSACTION
router.post('/transaction', (req, res) => {
    try {
        const t = moment().unix();
        console.log("{ \"timestamp\" : %d, \"msg\" : \"Adding Expense\", \"amount\" : %d, \"Description\": \"%s\" }", t, req.body.amount, req.body.desc);
        var success = transactionService.addTransaction(req.body.amount, req.body.desc);
        if (success === 200) {
            res.json({ message: 'added transaction successfully' });
        } else {
            res.statusCode = 500;
            res.json({ message: 'transaction was not added' });
        }
    } catch (err) {
        res.statusCode = 500;
        res.json({ message: 'something went wrong', error: err.message });
    }
});

// GET ALL TRANSACTIONS
router.get('/transaction', (req, res) => {
    try {
        var transactionList = [];
        transactionService.getAllTransactions(function (results) {
            for (const row of results) {
                transactionList.push({ "id": row.id, "amount": row.amount, "description": row.description });
            }
            const t = moment().unix();
            console.log("{ \"timestamp\" : %d, \"msg\" : \"Getting All Expenses\" }", t);
            console.log("{ \"expenses\" : %j }", transactionList);
            res.statusCode = 200;
            res.json({ "result": transactionList });
        });
    } catch (err) {
        res.statusCode = 500;
        res.json({ message: "could not get all transactions", error: err.message });
    }
});

// DELETE ALL TRANSACTIONS
router.delete('/transaction', (req, res) => {
    try {
        transactionService.deleteAllTransactions(function (result) {
            const t = moment().unix();
            console.log("{ \"timestamp\" : %d, \"msg\" : \"Deleted All Expenses\" }", t);
            res.statusCode = 200;
            res.json({ message: "delete function execution finished." });
        });
    } catch (err) {
        res.statusCode = 500;
        res.json({ message: "Deleting all transactions may have failed.", error: err.message });
    }
});

// DELETE ONE TRANSACTION
router.delete('/transaction/:id', (req, res) => {
    try {
        transactionService.deleteTransactionById(req.params.id, function (result) {
            res.statusCode = 200;
            res.json({ message: `transaction with id ${req.params.id} seemingly deleted` });
        });
    } catch (err) {
        res.statusCode = 500;
        res.json({ message: "error deleting transaction", error: err.message });
    }
});

// GET SINGLE TRANSACTION
router.get('/transaction/:id', (req, res) => {
    try {
        transactionService.findTransactionById(req.params.id, function (result) {
            res.statusCode = 200;
            var id = result[0].id;
            var amt = result[0].amount;
            var desc = result[0].desc;
            res.json({ "id": id, "amount": amt, "desc": desc });
        });
    } catch (err) {
        res.statusCode = 500;
        res.json({ message: "error retrieving transaction", error: err.message });
    }
});

app.use('/api', router);

app.listen(port, () => {
    const t = moment().unix();
    console.log("{ \"timestamp\" : %d, \"msg\" : \"App Started on Port %s\" }", t, port);
});