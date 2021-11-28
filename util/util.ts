import elliptic from 'elliptic';
//const EC = require('elliptic').ec;
const ec = new elliptic.ec('secp256k1');
import {v1} from 'uuid';
import SHA256 from "crypto-js/sha256";

export class Util {
    static getKeyPair() {
        let t = ec.keyPair
        return ec.genKeyPair();
    }
    static newId() {
        return v1();
    }
    static hash(data: string | any[]) {
        return SHA256(JSON.stringify(data)).toString();
    }
    static verifySignature(publicKey: any, signature: any, dataHash: any) {
        //console.log(`Attempting to verify signature - 
        //            PublicKey: ${publicKey}, 
        //            DataHash: ${dataHash},
        //            Signature: ${signature}`)
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
    }
}