const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain', () => {
    let bc, bc2;

    beforeEach(() => {
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it('starts with the genesis block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block', () => {
        const data = 'foo';
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    });

    it('validates a valid chain', () => {
        bc2.addBlock('test');
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    })

    it('invalidates a chain with corrupt genesis block', () => {
        bc2.chain[0].data = 'Bad data';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    })

    it('invalidates a corrupt chain', () => {
        bc2.addBlock('test');
        bc2.chain[1].data = 'something else';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    })

    it('it replaces chain with valid chain', () => {
        bc2.addBlock('new data');
        bc.replaceChain(bc2);
        expect(bc.chain).toEqual(bc2.chain);
    })

    it('doesn\'t accept a corrupt chain', () => {
        bc2.addBlock('test');
        bc2.chain[1].data = 'Changed data';
        bc.replaceChain(bc2);
        expect(bc.chain).not.toEqual(bc2.chain);
    })

    it('doesn\'t accept a shorter chain', () => {
        bc.addBlock('test');
        bc.addBlock('test');
        bc.replaceChain(bc2);
        expect(bc.chain).not.toEqual(bc2.chain);
    })
});