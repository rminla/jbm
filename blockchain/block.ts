const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
    timestamp: number;
    lastHash: string;
    hash: string;
    data: string;
    nonce: number;
    difficulty: number;

    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
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
        return new this('Genesis time', '-----', 'first-hash', [], 0, DIFFICULTY);
    }

    static mineBlock(lastBlock, data) {

        let timestamp = Date.now();
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;

        let nonce = 0;
        let hash = ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
        while (hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
            //console.log(`Current hash: ${hash}`);
        }
        //console.log(`WINNING hash: ${hash}`);

        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block;
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}


module.exports = Block;