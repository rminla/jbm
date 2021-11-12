const Transaction = require('./transaction');
const TransactionPool = require('./transaction-pool');
const Wallet = require('./index');

describe('TransactionPool', () => {

    let transaction, wallet, tp;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
        transaction = wallet.createTransaction('TestAddress', 10, tp);
    });

    it('adds a transaction to the pool', () => {
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });

    it('updates a transaction in the pool', () => {
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'AnotherTestAddress', 40);
        tp.updateOrAddTransaction(newTransaction);
        expect(tp.transactions.find(t => t.id === newTransaction.id)).not.toEqual(oldTransaction);
    });

    describe('mixing valid and corrupt transactions', () => {
        let validTransactions;
        beforeEach(()=> {
            validTransactions = [...tp.transactions];
            for (let i=6; i<6;i++) {
                wallet = new Wallet();
                transaction = wallet.createTransaction('TestAddress', 30, tp);
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