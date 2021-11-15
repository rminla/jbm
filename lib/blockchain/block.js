"use strict";
// const ChainUtil = require('../chain-util');
// const { DIFFICULTY, MINE_RATE } = require('../config');
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
const chain_util_1 = require("../chain-util");
const config_1 = require("../config");
class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || config_1.DIFFICULTY;
    }
    toString() {
        return `Block - 
            Timestamp:   ${this.timestamp}
            Last Hash:   ${this.lastHash.substring(0, 10)}
            Hash:        ${this.hash.substring(0, 10)}
            Nonce:       ${this.nonce}
            Difficulty:  ${this.difficulty}
            Data:        ${this.data}`;
    }
    static genesis() {
        return new this(0, '-----', 'first-hash', [], 0, config_1.DIFFICULTY);
    }
    static mineBlock(lastBlock, data) {
        let timestamp = Date.now();
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;
        let hash = chain_util_1.ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
        while (hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = chain_util_1.ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
            //console.log(`Current hash: ${hash}`);
        }
        //console.log(`WINNING hash: ${hash}`);
        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }
    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block;
        return chain_util_1.ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
    }
    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + config_1.MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}
exports.Block = Block;
// module.exports = Block;
//# sourceMappingURL=block.js.map