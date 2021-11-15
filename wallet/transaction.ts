// const ChainUtil = require('../chain-util');

import { Wallet } from ".";
import { ChainUtil } from "../chain-util";

const TRANSACTION_TYPE = {
    valid: 'VALID',
    invalid: 'INVALID'
}

export class Transaction {
    id: string;
    input: any;
    outputs: any[];
    transactionType: string;


    constructor() {
        this.id = ChainUtil.newId();
        this.input = null;
        this.outputs = [];
        this.transactionType = TRANSACTION_TYPE.invalid;
    }

    update(senderWallet: Wallet, recipientAddress: string, amount: number) {

        console.log(`Before Update: ${this.toString()}`);
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

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

    static newTransaction(senderWallet: Wallet, recipientAddress: string, amount: number) {
        const transaction = new this();
        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance `);
            return;
        }
        transaction.outputs.push(...[
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
            { amount, address: recipientAddress }]);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }

    static signTransaction(transaction: Transaction, senderWallet: { balance: any; publicKey: any; sign: (arg0: any) => any; }) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        };
    }

    static verifyTransaction(transaction: Transaction) {
        return ChainUtil.verifySignature(transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs));
    }

    hasAddress(address: any) {
        return this.input.address === address;
    }

}

// module.exports = Transaction;