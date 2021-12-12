import express from 'express';
import bodyParser from 'body-parser';
import { Blockchain } from '../blockchain';
import { BlockchainNode } from '../server/blockchainnode';
import { Wallet } from '../wallet';
import { TransactionPool } from '../wallet/transaction-pool';
import { Block } from '../blockchain/block';
import { Miner } from './miner';

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const node = new BlockchainNode(bc, transactionPool);
const miner = new Miner(bc, transactionPool, wallet, node);

app.use(bodyParser.json());

app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`);
});

node.listen();

app.get('/block', (req: any, res: { json: (arg0: Block[]) => void; }) => {
    res.json(bc.chain);
});

app.post('/mine', (req: { body: { data: string; }; }, res: { redirect: (arg0: string) => void; }) => {
    const block = bc.addBlock(req.body.data);
    node.syncChains();
    console.log(`New block added: ${block.toString()}`);
    res.redirect('/block');
});

app.get('/transaction', (req: any, res) => {
    res.json(transactionPool.transactions);
});

app.post('/mine/transaction', (req: any, res) => {
    const block = miner.mine();
    console.log(`New block added: ${block.toString()}`);
    res.redirect('/block');
});

app.get('/transaction/valid', (req: any, res) => {
    res.json(transactionPool.getValidTransactions());
});

app.post('/transaction', (req: { body: { recipient: any; amount: any; }; }, res: { redirect: (arg0: string) => void; }) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, transactionPool);
    if (transaction) {
        node.broadcastTransaction(transaction);
    }
    res.redirect('/transaction');
});

app.get('/public-key', (req: any, res: { json: (arg0: { publicKey: any; }) => void; }) => {
    res.json({ publicKey: wallet.publicKey });
});

