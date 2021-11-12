const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction', () => {

    let transaction, wallet, recipient, amount;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        recipient = 'TestAddress';
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('Outputs the `amount` subtracted from the sender\'s wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
    });

    it('Outputs the `amount` added to the recipient\'s wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
    });

    it('Inputs the `balance` of the sender\'s wallet balance', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('Validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('Invalidates a corrupted transaction', () => {
        transaction.outputs[0].amount = 50000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    describe('Transaction with `amount` that exceeds wallet balance', () => {
        beforeEach(() => {
            amount = 50000;
            transaction = Transaction.newTransaction(wallet, recipient, amount);
        });

        it('Does not create a `transaction`', () => {
            expect(transaction).toEqual(undefined);
        })
    });

    describe('updating a transaction', () => {
        let nextAmount, nextRecipient;
        beforeEach(() => {
            nextAmount = 20;
            nextRecipient = 'testRecipientAddress';
            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        });

        it('subtracts an additional amount from the sender\'s output', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount - nextAmount);
        })

        it('outputs an amount for the next recipient', () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount).toEqual(nextAmount);
        })
    });

})