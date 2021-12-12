import { Transaction } from "./transaction";
import { TransactionPool } from "./transaction-pool";
export declare class Wallet {
    balance: number;
    keyPair: any;
    publicKey: any;
    constructor();
    toString(): string;
    sign(dataHash: string): any;
    createTransaction(recipient: string, amount: number, transactionPool: TransactionPool): Transaction | undefined;
    static getBlockchainWallet(): Wallet;
}
