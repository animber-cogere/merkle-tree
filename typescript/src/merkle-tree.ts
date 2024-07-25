import Block from './block';
import Transaction from './transaction';
import Proof from './proof';
import { getHash } from './utils';

// Define the MerkleTree class
export default class MerkleTree {
  // Array of leaf node hashes
  private leaves: string[];

  // 2D array representing the tree levels
  private tree: string[][]; 

  // Constructor initializes the tree using transactions from a block
  constructor(block: Block) {
    // Get the signatures of transactions as leaf nodes
    this.leaves = block.getTransactions().map(tx => tx.signature!);

    // Initialize the tree array
    this.tree = [];

    // Build the Merkle Tree
    this.buildTree();
  }

  // Build the Merkle Tree from the leaf nodes
  private buildTree(): void {
    // Add leaves as the first level of the tree
    this.tree.push(this.leaves);
    let level = this.leaves;

    // Continue building the tree until only one node (the root) remains
    while (level.length > 1) {
      // Build the next level
      level = this.buildNextLevel(level);

      // Add the new level to the beginning of the tree array
      this.tree.unshift(level);
    }
  }

  // Build the next level of the tree
  private buildNextLevel(level: string[]): string[] {
    // Initialize an array for the next level
    const nextLevel: string[] = [];
    for (let i = 0; i < level.length; i += 2) {
      if (i + 1 < level.length) {
        // If there is a pair, combine their hashes and add to the next level
        nextLevel.push(getHash(level[i] + level[i + 1]));
      } else {
        // If there is no pair, just add the single node to the next level
        nextLevel.push(level[i]);
      }
    }

    // Return the next level array
    return nextLevel;
  }

  // Get the root of the Merkle Tree
  getRoot(): string {
    // The root is the only element in the first level
    return this.tree[0][0];
  }

  // Get the Merkle proof for a given transaction
  getProof(tx: Transaction): Proof[] {
    // Find the index of the transaction's signature
    let idx = this.leaves.indexOf(tx.signature!);
    if (idx == -1)
      return [];

    // Initialize an array for the proof
    let proof: Proof[] = [];

    // Traverse from the leaf node to the root, collecting proof nodes
    for (let i = this.tree.length - 1; i > 0; i--) {
      let level = this.tree[i];

      // Determine the index of the sibling node
      const pairIndex = idx % 2 === 0 ? idx + 1 : idx - 1;
    
      if (pairIndex < level.length) {
        // Add the sibling node to the proof
        proof.push({
          hash: level[pairIndex],
          right: pairIndex % 2 != 0 // Indicate if the sibling is a right node
        });
      }
      // Move to the parent node index
      idx = Math.floor(idx / 2);
    }

    // Return the proof array
    return proof;
  }

  // Verify a Merkle proof
  static verifyProof(root: string, proof: Proof[], targetHash: string): boolean {
    // Start with the target hash
    let hash = targetHash;

    // Recalculate the hash moving up the tree using the proof
    for (let node of proof) {
      let combined = node.right ? hash + node.hash : node.hash + hash;
      
      // Hash the combined string
      hash = getHash(combined);
    }

    // Return true if the final hash matches the root
    return hash === root;
  }
}