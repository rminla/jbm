import { BlockchainNode } from '../server/blockchainnode';
import { Blockchain } from "../blockchain";
import { TransactionPool } from "../wallet/transaction-pool";
export declare class Miner {
    blockchain: Blockchain;
    transactionPool: TransactionPool;
    wallet: any;
    node: BlockchainNode;
    constructor(blockchain: Blockchain, transactionPool: TransactionPool, wallet: any, node: BlockchainNode);
    mine(): import("../blockchain/block").Block;
}
