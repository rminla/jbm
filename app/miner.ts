const P2pServer = require('./p2pserver');
import { Blockchain } from "../blockchain";
import { TransactionPool } from "../wallet/transaction-pool";
export class Miner {

    blockchain: Blockchain;
    transactionPool: TransactionPool;
    wallet: any;
    p2pServer: InstanceType<typeof P2pServer>;
    
    constructor(blockchain: Blockchain, transactionPool: TransactionPool, wallet: any, p2pServer: InstanceType<typeof P2pServer>) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    } 

    mine() {

        const validTransactions = this.transactionPool.getValidTransactions();
        
        //include a reward for the miner

        //add a block of valid transactions

        //send block to other nodes (sync chains)

        //clear the transaction pool 
        
        //broadcase transaction pool clear

    }
}

// module.exports = Miner;