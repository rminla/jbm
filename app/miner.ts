import { BlockchainNode } from '../server/blockchainnode';
import { Blockchain } from "../blockchain";
import { Transaction } from "../wallet/transaction";
import { TransactionPool } from "../wallet/transaction-pool";
export class Miner {

    blockchain: Blockchain;
    transactionPool: TransactionPool;
    wallet: any;
    node: BlockchainNode;
    
    constructor(blockchain: Blockchain, transactionPool: TransactionPool, wallet: any, node: BlockchainNode) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.node = node;
    } 

    mine() {

        const validTransactions = this.transactionPool.getValidTransactions();
        
        //include a reward for the miner
        validTransactions.push(Transaction.createRewardTransaction(this.wallet));

        //add a block of valid transactions
        const block = this.blockchain.addBlock(JSON.stringify(validTransactions));

        //send block to other nodes (sync chains)
        this.node.syncChains();

        //clear the transaction pool 
        this.transactionPool.clear();
        
        //broadcast transaction pool clear
        this.node.broadcastClearTransactions();

        return block;

    }
}