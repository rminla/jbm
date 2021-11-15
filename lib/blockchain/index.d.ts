import { Block } from "./block";
export declare class Blockchain {
    chain: Block[];
    constructor();
    addBlock(data: string): Block;
    isValidChain(chain: Block[]): boolean;
    replaceChain(newChain: Blockchain): void;
}
