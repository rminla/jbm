export declare class Block {
    timestamp: number;
    lastHash: string;
    hash: string;
    data: any;
    nonce: number;
    difficulty: number;
    constructor(timestamp: number, lastHash: string, hash: string, data: any, nonce: number, difficulty: number);
    toString(): string;
    static createGenesis(): Block;
    static mineBlock(lastBlock: Block, data: string): Block;
    static blockHash(block: Block): string;
    static adjustDifficulty(lastBlock: Block, currentTime: number): number;
}
