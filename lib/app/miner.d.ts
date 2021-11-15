declare const P2pServer: any;
import { Blockchain } from "../blockchain";
import { TransactionPool } from "../wallet/transaction-pool";
export declare class Miner {
    blockchain: Blockchain;
    transactionPool: TransactionPool;
    wallet: any;
    p2pServer: InstanceType<typeof P2pServer>;
    constructor(blockchain: Blockchain, transactionPool: TransactionPool, wallet: any, p2pServer: InstanceType<typeof P2pServer>);
    mine(): void;
}
export {};
