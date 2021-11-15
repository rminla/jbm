import { Blockchain } from "../blockchain";

import WS from "ws";
import { Transaction } from "../wallet/transaction";
import { TransactionPool } from "../wallet/transaction-pool";
const P2P_PORT : number | undefined = <number | undefined>process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION'
}

export class P2pServer {
    blockchain: Blockchain;
    transactionPool: TransactionPool;
    sockets: WS.WebSocket[];

    constructor(blockchain: Blockchain, transactionPool: TransactionPool) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
    }

    listen() {
        const server = new WS.Server({ port: P2P_PORT });
        server.on('connection', (socket: WS.WebSocket) => this.connectSocket(socket));
        this.connectToPeers();
        console.log(`Listening for peer-to-peer connections on port: ${P2P_PORT}`);
    }

    connectToPeers() {
        peers.forEach(peer => {
            const socket = new WS.WebSocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        });
    }

    connectSocket(socket : WS.WebSocket) {
        this.sockets.push(socket);
        this.messageHandler(socket);
        this.sendChain(socket);
        console.log(`Socket connected: ${socket.url}`);
    }

    messageHandler(socket : WS.WebSocket) {
        socket.on('message', (message: string) => {
            const data = JSON.parse(message);
            console.log(data);
            switch(data.type) {
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
            }
        })
    }

    sendChain(socket: WS.WebSocket) {
        socket.send(JSON.stringify( { 
            type: MESSAGE_TYPES.chain,
            chain: this.blockchain
        }));
    }

    sendTransaction(socket: WS.WebSocket, transaction: Transaction) {
        socket.send( 
            JSON.stringify({
                type: MESSAGE_TYPES.transaction,
                transaction:transaction
            })
        );
    }

    syncChains() {
        this.sockets.forEach(socket => {
            this.sendChain(socket);
        })
    }

    broadcastTransaction(transaction: Transaction) {
        this.sockets.forEach(socket => {
            this.sendTransaction(socket, transaction);
        })
    }
}

// module.exports = P2pServer;