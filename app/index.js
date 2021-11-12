const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const TransactionPool = require('../wallet/transaction-pool');
const Wallet = require('../wallet');
const P2pServer = require('./p2pserver');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const p2pServer = new P2pServer(bc, transactionPool);

app.use(bodyParser.json());

app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`);
});

p2pServer.listen();

app.get('/block', (req, res) => {
    res.json(bc.chain);
});

app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data);
    p2pServer.syncChains();
    console.log(`New block added: ${block.toString()}`);
    res.redirect('/block');
});

app.get('/transaction', (req, res) => {
    res.json(transactionPool.transactions);
});

app.post('/transaction', (req, res) => {
    const {recipient, amount} = req.body;
    const transaction = wallet.createTransaction(recipient, amount, transactionPool);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transaction');
});

app.get('/public-key', (req, res) => {
    res.json({ publicKey: wallet.publicKey } );
});

