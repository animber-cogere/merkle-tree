// Define the Transaction interface
export default interface Transaction {
  timestamp?: string; // The timestamp of the transaction
  address: string;    // The address of the recipient of the transaction
  amount: number;     // The amount of tokens or currency to be transferred in the transaction
  signature?: string; // The transaction's signature
}