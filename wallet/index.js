const { INITIAL_BALANCE } = require("../config");
const ChainUtil = require('../chain-util');
const Transaction = require("./transaction");

class Wallet {

    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.getKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet -
                Balance  : ${this.balance}
                PublicKey: ${this.publicKey.toString()}`;
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, transactionPool) {
        if (amount > this.balance) {
            console.log(`Amount ${amount} exceeds the current balance of ${this.balance}`);
            return;
        }
        let oldTransaction = transactionPool.getTransaction(this.publicKey);
        if (oldTransaction) {
            oldTransaction.update(this,recipient, amount);
        } else {
            const transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
            return transaction;
        }
    }

}

module.exports = Wallet;