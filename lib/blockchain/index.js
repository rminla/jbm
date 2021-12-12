"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
const block_1 = require("./block");
class Blockchain {
    constructor() {
        this.chain = [block_1.Block.createGenesis()];
    }
    addBlock(data) {
        const block = block_1.Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);
        return block;
    }
    isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(block_1.Block.createGenesis())) {
            //console.log(`Bad genesis block in new chain: 
            //            ${chain[0].toString()}`);
            return false;
        }
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];
            if (block.lastHash !== lastBlock.hash || (block.hash !== block_1.Block.blockHash(block))) {
                return false;
            }
        }
        return true;
    }
    replaceChain(newChain) {
        //console.log(`New chain: ${newChain} length: ${newChain.chain.length}; genesis: ${newChain.chain[0]}`);
        if (newChain.chain.length <= this.chain.length) {
            console.log("New chain is not longer than current chain");
            return;
        }
        if (!this.isValidChain(newChain.chain)) {
            console.log("New chain is not valid");
            return;
        }
        this.chain = newChain.chain;
        console.log("Replacing chain with new chain");
    }
}
exports.Blockchain = Blockchain;
//# sourceMappingURL=index.js.map