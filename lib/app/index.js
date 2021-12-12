"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const blockchain_1 = require("../blockchain");
const blockchainnode_1 = require("../server/blockchainnode");
const wallet_1 = require("../wallet");
const transaction_pool_1 = require("../wallet/transaction-pool");
const miner_1 = require("./miner");
const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = (0, express_1.default)();
const bc = new blockchain_1.Blockchain();
const wallet = new wallet_1.Wallet();
const transactionPool = new transaction_pool_1.TransactionPool();
const node = new blockchainnode_1.BlockchainNode(bc, transactionPool);
const miner = new miner_1.Miner(bc, transactionPool, wallet, node);
app.use(body_parser_1.default.json());
app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`);
});
node.listen();
app.get('/block', (req, res) => {
    res.json(bc.chain);
});
app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data);
    node.syncChains();
    console.log(`New block added: ${block.toString()}`);
    res.redirect('/block');
});
app.get('/transaction', (req, res) => {
    res.json(transactionPool.transactions);
});
app.post('/mine/transaction', (req, res) => {
    const block = miner.mine();
    console.log(`New block added: ${block.toString()}`);
    res.redirect('/block');
});
app.get('/transaction/valid', (req, res) => {
    res.json(transactionPool.getValidTransactions());
});
app.post('/transaction', (req, res) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, transactionPool);
    if (transaction) {
        node.broadcastTransaction(transaction);
    }
    res.redirect('/transaction');
});
app.get('/public-key', (req, res) => {
    res.json({ publicKey: wallet.publicKey });
});
//# sourceMappingURL=index.js.map