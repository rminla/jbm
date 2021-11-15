export declare class Block {
    timestamp: number;
    lastHash: string;
    hash: string;
    data: any;
    nonce: number;
    difficulty: number;
    constructor(timestamp: number, lastHash: string, hash: string, data: any, nonce: number, difficulty: number);
    toString(): string;
    static genesis(): Block;
    static mineBlock(lastBlock: Block, data: string): Block;
    static blockHash(block: Block): any;
    static adjustDifficulty(lastBlock: Block, currentTime: number): number;
}
