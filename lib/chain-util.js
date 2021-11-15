"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainUtil = void 0;
const EC = require('elliptic').ec;
const uuid = require('uuid');
const ec = new EC('secp256k1');
const SHA256 = require("crypto-js/sha256");
class ChainUtil {
    static getKeyPair() {
        return ec.genKeyPair();
    }
    static newId() {
        return uuid.v1();
    }
    static hash(data) {
        return SHA256(JSON.stringify(data)).toString();
    }
    static verifySignature(publicKey, signature, dataHash) {
        //console.log(`Attempting to verify signature - 
        //            PublicKey: ${publicKey}, 
        //            DataHash: ${dataHash},
        //            Signature: ${signature}`)
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
    }
}
exports.ChainUtil = ChainUtil;
// module.exports = ChainUtil;
//# sourceMappingURL=chain-util.js.map