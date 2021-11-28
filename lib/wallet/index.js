"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const util_1 = require("../util");
const config_1 = require("../config");
const transaction_1 = require("./transaction");
class Wallet {
    constructor() {
        this.balance = config_1.INITIAL_BALANCE;
        this.keyPair = util_1.Util.getKeyPair();
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
            oldTransaction.update(this, recipient, amount);
        }
        else {
            const transaction = transaction_1.Transaction.newTransaction(this, recipient, amount);
            if (transaction) {
                transactionPool.updateOrAddTransaction(transaction);
                return transaction;
            }
        }
    }
    static blockchainWallet() {
        const blockchainWallet = new this();
        // blockchainWallet.publicKey = BLOCKCHAIN_WALLET_ADDRESS;
        return blockchainWallet;
    }
}
exports.Wallet = Wallet;
// module.exports = Wallet;
//# sourceMappingURL=index.js.map