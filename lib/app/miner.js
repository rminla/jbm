"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miner = void 0;
const P2pServer = require('./p2pserver');
class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer) {
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
exports.Miner = Miner;
// module.exports = Miner;
//# sourceMappingURL=miner.js.map