import { Wallet } from ".";
export declare class Transaction {
    id: string;
    input: any;
    outputs: any[];
    transactionType: string;
    constructor();
    update(senderWallet: Wallet, recipientAddress: string, amount: number): this | undefined;
    static newTransaction(senderWallet: Wallet, recipientAddress: string, amount: number): Transaction | undefined;
    static signTransaction(transaction: Transaction, senderWallet: {
        balance: any;
        publicKey: any;
        sign: (arg0: any) => any;
    }): void;
    static verifyTransaction(transaction: Transaction): any;
    hasAddress(address: any): boolean;
}
