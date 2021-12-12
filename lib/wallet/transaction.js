"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const _1 = require(".");
const config_1 = require("../config");
const util_1 = require("../util/util");
const TRANSACTION_TYPE = {
    valid: 'VALID',
    invalid: 'INVALID'
};
class Transaction {
    constructor() {
        this.id = util_1.Util.newId();
        this.input = null;
        this.outputs = [];
        this.transactionType = TRANSACTION_TYPE.invalid;
    }
    update(senderWallet, recipientAddress, amount) {
        console.log(`Before Update: ${this.toString()}`);
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
        if (senderOutput === undefined) {
            console.log(`Cannot update transaction since sender output not found.`);
            return;
        }
        if (amount > senderOutput.amount) {
            console.log(`Cannot update transaction since amount ${amount} exceeds balance.`);
            return;
        }
        senderOutput.amount -= amount;
        this.outputs.push({ amount, address: recipientAddress });
        Transaction.signTransaction(this, senderWallet);
        console.log(`After Update: ${this.toString()}`);
        return this;
    }
    static newTransaction(senderWallet, recipientAddress, amount) {
        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance `);
            return;
        }
        return Transaction.transactionWithOutputs(senderWallet, [
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
            { amount, address: recipientAddress }
        ]);
    }
    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(util_1.Util.hash(transaction.outputs))
        };
    }
    static verifyTransaction(transaction) {
        var _a, _b;
        return util_1.Util.verifySignature((_a = transaction.input) === null || _a === void 0 ? void 0 : _a.address, (_b = transaction.input) === null || _b === void 0 ? void 0 : _b.signature, util_1.Util.hash(transaction.outputs));
    }
    hasAddress(address) {
        var _a;
        return ((_a = this.input) === null || _a === void 0 ? void 0 : _a.address) === address;
    }
    //TODO: Add COINBASE_MATURITY to prevent double-spend for orphaned chains (consensus.h in bitcoin source)
    //ALSO: reward transaction should be called "CoinbaseTransaction" and that's a transaction with a single output (going to the miner)
    static createRewardTransaction(recipientAddress) {
        return Transaction.transactionWithOutputs(_1.Wallet.getBlockchainWallet(), [{ amount: config_1.MINING_REWARD, address: recipientAddress }]);
    }
    static transactionWithOutputs(senderWallet, outputs) {
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }
}
exports.Transaction = Transaction;
class Output {
    constructor(amount, address) {
        this.amount = amount;
        this.address = address;
    }
}
class Input {
    constructor(timestamp, amount, address, signature) {
        this.timestamp = timestamp;
        this.amount = amount;
        this.address = address;
        this.signature = signature;
    }
}
//# sourceMappingURL=transaction.js.map