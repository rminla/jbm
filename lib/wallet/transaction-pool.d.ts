import { Transaction } from "./transaction";
export declare class TransactionPool {
    transactions: Transaction[];
    constructor();
    updateOrAddTransaction(transaction: Transaction): void;
    getTransaction(address: string): Transaction | undefined;
    getValidTransactions(): Transaction[];
    clear(): void;
}
