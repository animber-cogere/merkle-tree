import Transaction from './transaction';
import { getHash } from './utils';
import { Keypair } from '@solana/web3.js';

// Define a Block class
export default class Block {
  // Private property to store an array of transactions
  private transactions: Transaction[] = [];

  // Constructor to initialize the Block object
  // and clear any existing transactions
  constructor(transactions?: Transaction[]) {
    this.clear();
    if (transactions) {
      transactions.map(tx => this.push(tx));
    }
  }

  // Method to add a transaction to the block
  public push(tx: Transaction) {
    // Calculate the hash of the transaction and set it as the signature
    tx.timestamp = Date.now().toString();
    tx.signature = getHash(JSON.stringify(tx), false);

    // Add the transaction to the transactions array
    this.transactions.push(tx);
  }

  // Method to retrieve all transactions in the block
  public getTransactions(): Transaction[] {
    return this.transactions;
  }

  public getTransaction(index: number): Transaction {
    return this.transactions[index];
  }

  // Method to get the number of transactions in the block
  public getTransactionNum() {
    return this.transactions.length;
  }

  // Method to clear all transactions in the block
  public clear() {
    this.transactions = [];
  }

  // Static method to generate a random public key
  private static generateRandomPublicKey(): string {
    // Create a new keypair using the Keypair class
    const keypair = Keypair.generate();
    
    // Extract the public key from the keypair and convert it to a Base58 string
    const publicKey = keypair.publicKey.toBase58();
    
    // Return the public key as a string
    return publicKey;
  }  

  // Method to create a test block with a random number of transactions (between 2000 and 5000)
  public createTestBlock() {
    // Clear any existing transactions
    this.clear();
    
    // Generate a random number of transactions between 2000 and 5000
    let number = Math.floor(2000 + 3000 * Math.random());
    
    // Loop to create the specified number of transactions
    for (let i = 0; i < number; ++i) {
      // Generate a random public key as the address
      let address = Block.generateRandomPublicKey();

      // Generate a random amount between 0 and 999
      let amount = Math.floor(1000 * Math.random());

      // Add the transaction to the block
      this.push({ address, amount });
    }
  }
}