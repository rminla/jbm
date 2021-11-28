import { Block } from "./block";

export class Blockchain {
    chain: Block[];
    constructor() {
        this.chain = [Block.createGenesis()];
    }

    addBlock(data: string) {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);
        return block;
    }

    isValidChain(chain: Block[]) {

        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.createGenesis())) {
            //console.log(`Bad genesis block in new chain: 
            //            ${chain[0].toString()}`);
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];
            if (block.lastHash !== lastBlock.hash || (block.hash !== Block.blockHash(block))) {
                return false;
            }
        }
        return true;

    }

    replaceChain(newChain : Blockchain) {
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

// module.exports = Blockchain;