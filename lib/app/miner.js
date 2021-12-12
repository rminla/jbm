"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miner = void 0;
const transaction_1 = require("../wallet/transaction");
class Miner {
    constructor(blockchain, transactionPool, wallet, node) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.node = node;
    }
    mine() {
        const validTransactions = this.transactionPool.getValidTransactions();
        //include a reward for the miner
        validTransactions.push(transaction_1.Transaction.createRewardTransaction(this.wallet));
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
exports.Miner = Miner;
//# sourceMappingURL=miner.js.map