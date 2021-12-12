"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionPool = void 0;
const transaction_1 = require("./transaction");
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
        return this.transactions.find(t => { var _a; return ((_a = t.input) === null || _a === void 0 ? void 0 : _a.address) === address; });
    }
    getValidTransactions() {
        return this.transactions.filter(t => {
            var _a, _b;
            const outputTotal = t.outputs.reduce((total, output) => {
                return total + output.amount;
            }, 0);
            if (((_a = t.input) === null || _a === void 0 ? void 0 : _a.amount) !== outputTotal) {
                console.log(`Invalid transaction from ${(_b = t.input) === null || _b === void 0 ? void 0 : _b.address}`);
                return;
            }
            if (!transaction_1.Transaction.verifyTransaction(t)) {
                console.log(`Invalid signature from ${t.input.address}`);
                return;
            }
            return t;
        });
    }
    clear() {
        this.transactions = [];
    }
}
exports.TransactionPool = TransactionPool;
//# sourceMappingURL=transaction-pool.js.map