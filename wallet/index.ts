import { Util } from "../util";
import { BLOCKCHAIN_WALLET_ADDRESS, INITIAL_BALANCE } from "../config";
import { Transaction } from "./transaction";
import { TransactionPool } from "./transaction-pool";

export class Wallet {
    balance: number;
    keyPair: any;
    publicKey: any;

    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = Util.getKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet -
                Balance  : ${this.balance}
                PublicKey: ${this.publicKey.toString()}`;
    }

    sign(dataHash: string) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient: string, amount: number, transactionPool: TransactionPool) {
        if (amount > this.balance) {
            console.log(`Amount ${amount} exceeds the current balance of ${this.balance}`);
            return;
        }
        let oldTransaction = transactionPool.getTransaction(this.publicKey);
        if (oldTransaction) {
            oldTransaction.update(this, recipient, amount);
        } else {
            const transaction = Transaction.newTransaction(this, recipient, amount);
            if (transaction) {
                transactionPool.updateOrAddTransaction(transaction);
                return transaction;
            }
        }
    }
    
    static getBlockchainWallet() {     //TODO: FIX THIS.  NEED A WAY TO STORE THE BLOCKCHAIN WALLET KEYS BETWEEN SESSIONS
        const blockchainWallet = new this();
        // blockchainWallet.publicKey = BLOCKCHAIN_WALLET_ADDRESS;
        return blockchainWallet;
    }
}