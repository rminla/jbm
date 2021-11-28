import { Wallet } from ".";
import { Transaction } from "./transaction";
import { TransactionPool } from "./transaction-pool";

describe('TransactionPool', () => {

    let transaction: Transaction, wallet: Wallet, tp: TransactionPool;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
        transaction = <Transaction>wallet.createTransaction('TestAddress', 10, tp);
    });

    it('adds a transaction to the pool', () => {
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });

    it('updates a transaction in the pool', () => {
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = <Transaction>transaction.update(wallet, 'AnotherTestAddress', 40);
        tp.updateOrAddTransaction(newTransaction);
        expect(tp.transactions.find(t => t.id === newTransaction.id)).not.toEqual(oldTransaction);
    });

    describe('mixing valid and corrupt transactions', () => {
        let validTransactions: Transaction[];
        beforeEach(()=> {
            validTransactions = [...tp.transactions]; 
            for (let i=0; i<6;i++) {
                wallet = new Wallet();
                transaction = <Transaction>wallet.createTransaction('TestAddress', 30, tp);
                if (i%2==0) {
                    transaction.input.amount = 99999;
                } else {
                    validTransactions.push(transaction);
                }
            }
        });

        it('shows a difference between valid and corrupt transactions', () => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(tp.getValidTransactions()));
        });

        it('gets valid transactions', () => {
            expect(JSON.stringify(tp.getValidTransactions())).toEqual(JSON.stringify(validTransactions));
        });
    })

});