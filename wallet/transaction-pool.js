const Transaction = require("./transaction");

class TransactionPool {
    
    constructor() {
        this.transactions = [];
    }

    updateOrAddTransaction(transaction) {
        let oldTransaction = this.transactions.find(t=>t.id===transaction.id); 
        if (oldTransaction) {
            this.transactions[this.transactions.indexOf[oldTransaction]] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    getTransaction(address) {
        return this.transactions.find(t=>t.address === address);
    }

    getValidTransactions() {
        this.transactions.filter(t => {
            
            const outputTotal = t.outputs.reduce((total, output) => {
                total + output.amount
            }, 0);
            
            if (t.input.amount !== outputTotal) {
                console.log(`Invalid transaction from ${t.input.address}`);
                return;
            }

            if (!Transaction.verifyTransaction(t) ) {
                console.log(`Invalid signature from ${t.input.address}`);
                return;   
            }

            return t;

        });
    }
}
module.exports = TransactionPool;