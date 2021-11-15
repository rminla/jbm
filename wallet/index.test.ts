import { Wallet } from ".";
import { Transaction } from "./transaction";
import { TransactionPool } from "./transaction-pool";

describe('Wallet', () => {
  let wallet: Wallet, transactionPool: TransactionPool;
  beforeEach(() => {
      wallet = new Wallet();
      transactionPool = new TransactionPool();
  });

  describe('creating a transaction', () => {
      let transaction: Transaction, sendAmount: number, recipient: string;

      beforeEach(()=> {
          sendAmount = 50;
          recipient = 'test-recipient-address';
          transaction = <Transaction>wallet.createTransaction(recipient, sendAmount, transactionPool);
      });

      describe(() => 'and doing the same transaction', () => {
          beforeEach(()=> {
              wallet.createTransaction(recipient, sendAmount, transactionPool);
          });

          it('doubles the `sendAmount` subtracted from the wallet balance', ()=> {
              expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - sendAmount * 2);
          });

          it('clones the `sendAmount` output for the recipient', ()=> {
              expect(transaction.outputs.filter(output => output.address === recipient).map(output=>output.amount)).toEqual([sendAmount, sendAmount]);
          });


      });


  })


})