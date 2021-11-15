"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionPool = void 0;
const transaction_1 = require("./transaction");
// const Transaction = require("./transaction");
class TransactionPool {
    constructor() {
        this.transactions = [];
    }
    updateOrAddTransaction(transaction) {
        let oldTransaction = this.transactions.find(t => t.id === transaction.id);
        if (oldTransaction) {
            this.transactions[this.transactions.indexOf(oldTransaction)] = transaction;
        }
        else {
            this.transactions.push(transaction);
        }
    }
    getTransaction(address) {
        return this.transactions.find(t => t.input.address === address);
    }
    getValidTransactions() {
        this.transactions.filter(t => {
            const outputTotal = t.outputs.reduce((total, output) => {
                total + output.amount;
            }, 0);
            if (t.input.amount !== outputTotal) {
                console.log(`Invalid transaction from ${t.input.address}`);
                return;
            }
            if (!transaction_1.Transaction.verifyTransaction(t)) {
                console.log(`Invalid signature from ${t.input.address}`);
                return;
            }
            return t;
        });
    }
}
exports.TransactionPool = TransactionPool;
// module.exports = TransactionPool;
//# sourceMappingURL=transaction-pool.js.map