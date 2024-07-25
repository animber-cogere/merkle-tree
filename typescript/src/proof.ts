// Define the Proof interface
export default interface Proof {
  hash: string; // The hash value of the sibling node in the Merkle tree
  right: boolean; // Indicates if the sibling node is on the right (true) or on the left (false)
}