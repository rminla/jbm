"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.P2pServer = void 0;
const ws_1 = __importDefault(require("ws"));
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION'
};
class P2pServer {
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
    }
    listen() {
        const server = new ws_1.default.Server({ port: P2P_PORT });
        server.on('connection', (socket) => this.connectSocket(socket));
        this.connectToPeers();
        console.log(`Listening for peer-to-peer connections on port: ${P2P_PORT}`);
    }
    //TODO: add concept of seed nodes
    connectToPeers() {
        peers.forEach(peer => {
            const socket = new ws_1.default.WebSocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        });
    }
    connectSocket(socket) {
        this.sockets.push(socket);
        this.messageHandler(socket);
        this.sendChain(socket);
        console.log(`Socket connected: ${socket.url}`);
    }
    messageHandler(socket) {
        socket.on('message', (message) => {
            const data = JSON.parse(message);
            console.log(data);
            switch (data.type) {
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
            }
        });
    }
    sendChain(socket) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.chain,
            chain: this.blockchain
        }));
    }
    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.transaction,
            transaction: transaction
        }));
    }
    syncChains() {
        this.sockets.forEach(socket => {
            this.sendChain(socket);
        });
    }
    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => {
            this.sendTransaction(socket, transaction);
        });
    }
}
exports.P2pServer = P2pServer;
// module.exports = P2pServer;
//# sourceMappingURL=p2pserver.js.map