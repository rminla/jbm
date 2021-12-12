import { Wallet } from ".";
export declare class Transaction {
    id: string;
    input: Input | null;
    outputs: Output[];
    transactionType: string;
    constructor();
    update(senderWallet: Wallet, recipientAddress: string, amount: number): this | undefined;
    static newTransaction(senderWallet: Wallet, recipientAddress: string, amount: number): Transaction | undefined;
    static signTransaction(transaction: Transaction, senderWallet: Wallet): void;
    static verifyTransaction(transaction: Transaction): boolean;
    hasAddress(address: any): boolean;
    static createRewardTransaction(recipientAddress: string): Transaction;
    static transactionWithOutputs(senderWallet: Wallet, outputs: {
        amount: number;
        address: string;
    }[]): Transaction;
}
declare class Output {
    amount: number;
    address: string;
    constructor(amount: number, address: string);
}
declare class Input {
    timestamp: number;
    amount: number;
    address: string;
    signature: string;
    constructor(timestamp: number, amount: number, address: string, signature: string);
}
export {};
