"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
const util_1 = require("../util/util");
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
    //TODO: add equivalent of "pszTimestamp" to prove blockchain start
    static createGenesis() {
        return new this(0, '-----', 'first-hash', [], 0, config_1.DIFFICULTY);
    }
    static mineBlock(lastBlock, data) {
        let timestamp = Date.now();
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;
        let hash = util_1.Util.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
        while (hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = util_1.Util.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
            //console.log(`Current hash: ${hash}`);
        }
        //console.log(`WINNING hash: ${hash}`);
        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }
    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block;
        return util_1.Util.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
    }
    //note that in the real Bitcoin source code, this is done every two weeks, not every block
    //see CMainParams.consensus.nPowTargetTimespan and CMainParams.consensus.nPowTargetSpacing
    //in bitcoin sourcecode 
    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + config_1.MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}
exports.Block = Block;
//# sourceMappingURL=block.js.map