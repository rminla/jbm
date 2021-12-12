import { Transaction } from "./transaction";

export class TransactionPool {

    transactions: Transaction[];
    
    constructor() {
        this.transactions = [];
    }

    updateOrAddTransaction(transaction: Transaction) {
        let oldTransaction : Transaction | undefined = this.transactions.find(t=>t.id===transaction.id); 
        if (oldTransaction) {
            this.transactions[this.transactions.indexOf(oldTransaction)] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    getTransaction(address: string) {
        return this.transactions.find(t=>t.input?.address === address);
    }

    getValidTransactions() {

        return this.transactions.filter(t => {
            
            const outputTotal = t.outputs.reduce((total, output) => {
                return total + output.amount;
            }, 0);
            
            if (t.input?.amount !== outputTotal) {
                console.log(`Invalid transaction from ${t.input?.address}`);
                return;
            }

            if (!Transaction.verifyTransaction(t) ) {
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