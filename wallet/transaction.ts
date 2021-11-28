import { Wallet } from ".";
import { MINING_REWARD } from "../config";
import { Util } from "../util/util";

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
        this.id = Util.newId();
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
        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance `);
            return;
        }
        
        return Transaction.transactionWithOutputs(senderWallet, [
                 { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
                 { amount, address: recipientAddress }
                ]);
    }

    static signTransaction(transaction: Transaction, senderWallet: Wallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(Util.hash(transaction.outputs))
        };
    }

    static verifyTransaction(transaction: Transaction) {
        return Util.verifySignature(transaction.input.address,
            transaction.input.signature,
            Util.hash(transaction.outputs));
    }

    hasAddress(address: any) {
        return this.input.address === address;
    }

    //TODO: Add COINBASE_MATURITY to prevent double-spend for orphaned chains (consensus.h in bitcoin source)
    //ALSO: reward transaction should be called "CoinbaseTransaction" and that's a transaction with a single output (going to the miner)
    static createRewardTransaction(recipientAddress: string) {
        return Transaction.transactionWithOutputs(Wallet.blockchainWallet(), [{amount: MINING_REWARD, address: recipientAddress}])
    }

    static transactionWithOutputs(senderWallet: Wallet, outputs: { amount: number; address: string; }[]) {
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }

}