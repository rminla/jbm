import { Util } from "../util/util";
import { DIFFICULTY, MINE_RATE } from "../config";

export class Block {
    timestamp: number;
    lastHash: string;
    hash: string;
    data: any;
    nonce: number;
    difficulty: number;

    constructor(timestamp: number, lastHash: string, hash: string, data: any, nonce: number, difficulty: number) {
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

    //TODO: add equivalent of "pszTimestamp" to prove blockchain start
    static createGenesis() {
        return new this(0, '-----', 'first-hash', [], 0, DIFFICULTY);
    }

    static mineBlock(lastBlock : Block, data : string) {

        let timestamp = Date.now();
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;

        let nonce = 0;
        let hash = Util.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
        while (hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Util.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
            //console.log(`Current hash: ${hash}`);
        }
        //console.log(`WINNING hash: ${hash}`);

        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static blockHash(block : Block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block;
        return Util.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
    }


    //note that in the real Bitcoin source code, this is done every two weeks, not every block
    //see CMainParams.consensus.nPowTargetTimespan and CMainParams.consensus.nPowTargetSpacing
    //in bitcoin sourcecode 
    static adjustDifficulty(lastBlock : Block, currentTime : number) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}


// module.exports = Block;