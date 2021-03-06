import { Block } from "./block";

describe('Block', () => {

    let data: string, lastBlock: Block, block: Block;
    
    beforeEach(() => {
        data = 'bar';
        lastBlock = Block.createGenesis();
        block = Block.mineBlock(lastBlock, data);
    });
    
    it('sets the `data` to match the input', () => {
        expect(block.data).toEqual(data);
    });

    it('sets the `lastHash` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('generates a `hash` that matches our difficulty', () => {
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
        console.log(block.toString());
    });

    it('lowers the `difficulty` for slowly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 360000)).toEqual(block.difficulty-1);
        console.log(block.toString());
    });

    it('lowers the `difficulty` for quickly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty+1);
        console.log(block.toString());
    });

})