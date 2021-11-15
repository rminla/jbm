import { Blockchain } from "../blockchain";
import WS from "ws";
import { Transaction } from "../wallet/transaction";
import { TransactionPool } from "../wallet/transaction-pool";
export declare class P2pServer {
    blockchain: Blockchain;
    transactionPool: TransactionPool;
    sockets: WS.WebSocket[];
    constructor(blockchain: Blockchain, transactionPool: TransactionPool);
    listen(): void;
    connectToPeers(): void;
    connectSocket(socket: WS.WebSocket): void;
    messageHandler(socket: WS.WebSocket): void;
    sendChain(socket: WS.WebSocket): void;
    sendTransaction(socket: WS.WebSocket, transaction: Transaction): void;
    syncChains(): void;
    broadcastTransaction(transaction: Transaction): void;
}
