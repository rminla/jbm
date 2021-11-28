import elliptic from 'elliptic';
//const EC = require('elliptic').ec;
const ec = new elliptic.ec('secp256k1');
import {v4 as uuidv4} from 'uuid';
import SHA256 from "crypto-js/sha256";

export class Util {
    static getKeyPair() {
        // let t = ec.keyPair
        return ec.genKeyPair();
    }
    static newId() {
        return uuidv4();
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

    static createMerkleTree(transactions: string[]): string {
        let merkleRoot: string[] = Util.merkleTree(transactions);
        return merkleRoot[0];
    }

    static merkleTree(hashList: string[]) : string[] {

        if (hashList.length == 1) {
            return hashList;
        }

        let parentHashList = [];
        //Hash the leaf transaction pair to get parent transaction
        for (let i = 0; i < hashList.length; i += 2) {
            let hashedString: string = Util.hash(hashList[i].concat(hashList[i + 1]));
            parentHashList.push(hashedString);
        }
        // If odd number of transactions , add the last transaction again
        if (hashList.length % 2 == 1) {
            let lastHash : string = hashList[hashList.length - 1];
            let hashedString : string = Util.hash(lastHash.concat(lastHash));
            parentHashList.push(hashedString);
        }
        return Util.merkleTree(parentHashList);

    }
}