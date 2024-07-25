import Transaction from '../src/transaction';
import Block from '../src/block';
import MerkleTree from '../src/merkle-tree';
import { getHash } from '../src/utils';

describe('MerkleTree', () => {
  it('should handle an empty block', () => {
    let merkleTree = new MerkleTree(new Block());
    expect(merkleTree.getRoot()).toBeUndefined();
  });

  it('should handle a single transaction', () => {
    let block = new Block();
    block.push({ address: 'address1', amount: 100 });
    const merkleTree = new MerkleTree(block);
    
    const root = merkleTree.getRoot();
    expect(root).toBeDefined();

    let tx = block.getTransaction(0);
    const proof = merkleTree.getProof(tx);
    const isValid = MerkleTree.verifyProof(root, proof, tx.signature!);
    expect(isValid).toBe(true);
  });

  it('should handle an odd number of transactions', () => {
    const transactions = [
      { address: 'address1', amount: 100 },
      { address: 'address2', amount: 200 },
      { address: 'address3', amount: 300 }
    ];
    let block = new Block(transactions);
    const merkleTree = new MerkleTree(block);
    const root = merkleTree.getRoot();
    expect(root).toBeDefined();

    let tx = block.getTransaction(0);
    const proof = merkleTree.getProof(tx);
    const isValid = MerkleTree.verifyProof(root, proof, tx.signature!);
    expect(isValid).toBe(true);
  });

  it('should handle duplicate transactions', () => {
    const transactions = [
      { address: 'address1', amount: 100 },
      { address: 'address1', amount: 100 },
      { address: 'address2', amount: 200 }
    ];
    const block = new Block(transactions);
    const merkleTree = new MerkleTree(block);
    const root = merkleTree.getRoot();
    expect(root).toBeDefined();

    let tx = block.getTransaction(0);
    const proof = merkleTree.getProof(tx);
    const isValid = MerkleTree.verifyProof(root, proof, tx.signature!);
    expect(isValid).toBe(true);
  });


  it('should handle a large number of transactions', () => {
    const transactions = Array.from({ length: 99999 }, (_, i) => ({
      address: `address${i}`,
      amount: i * 10
    }));
    const block = new Block(transactions);
    const merkleTree = new MerkleTree(new Block(transactions));
    const root = merkleTree.getRoot();
    expect(root).toBeDefined();

    let tx = block.getTransaction(0);
    const proof = merkleTree.getProof(tx);
    const isValid = MerkleTree.verifyProof(root, proof, tx.signature!);
    expect(isValid).toBe(true);
  });

  it('should identify an incorrect proof', () => {
    const transactions = [
      { address: 'address1', amount: 100 },
      { address: 'address2', amount: 200 }
    ];
    const block = new Block(transactions);
    const merkleTree = new MerkleTree(block);
    const root = merkleTree.getRoot();
    expect(root).toBeDefined();

    let tx = block.getTransaction(0);
    const incorrectProof = [{hash: getHash('incorrect', false), right: true}];
    const isValid = MerkleTree.verifyProof(root, incorrectProof, tx.signature!);
    expect(isValid).toBe(false);
  });

  it('should identify an incorrect root', () => {
    const transactions = [
      { address: 'address1', amount: 100 },
      { address: 'address2', amount: 200 }
    ];
    const block = new Block(transactions);
    const merkleTree = new MerkleTree(block);
    const root = merkleTree.getRoot();
    expect(root).toBeDefined();

    let tx = block.getTransaction(0);
    const proof = merkleTree.getProof(tx);
    const incorrectRoot = getHash('incorrect', false);
    const isValid = MerkleTree.verifyProof(incorrectRoot, proof, tx.signature!);
    expect(isValid).toBe(false);
  });

  it('should identify a transaction not in the tree', () => {
    const transactions = [
      { address: 'address1', amount: 100 },
      { address: 'address2', amount: 200 }
    ];
    const block = new Block(transactions);
    const merkleTree = new MerkleTree(block);
    const root = merkleTree.getRoot();
    expect(root).toBeDefined();

    const notInTree: Transaction = { address: 'address3', amount: 300 };
    notInTree.signature = getHash(JSON.stringify(notInTree), false);
    const proof = merkleTree.getProof(notInTree);
    const isValid = MerkleTree.verifyProof(root, proof, notInTree.signature!);
    expect(isValid).toBe(false);
  });

  it('should handle an incorrect hashing algorithm', () => {
    const transactions = [
      { address: 'address1', amount: 100 },
      { address: 'address2', amount: 200 }
    ];
    const block = new Block(transactions);
    const merkleTree = new MerkleTree(block);
    const root = merkleTree.getRoot();

    let tx = block.getTransaction(0);
    const proof = merkleTree.getProof(tx);
    const isValid = MerkleTree.verifyProof(root, proof, tx.signature!);
    expect(isValid).toBe(true);

    const differentHash = proof.map(p => {
      p.hash = getHash(p.hash);
      return p;
    });
    const isValidWithDifferentHash = MerkleTree.verifyProof(root, differentHash, tx.signature!);
    expect(isValidWithDifferentHash).toBe(false);
  });

  it('Should correctly generate proof and verify transaction inclusion', () => {
    const block = new Block();
    // Root should be defined for test block
    block.createTestBlock();
    const merkleTree = new MerkleTree(block);
    expect(merkleTree.getRoot()).toBeDefined();

    // Choose an index and a transaction
    let index = Math.floor(block.getTransactionNum() * Math.random());
    const tx = block.getTransaction(index);

    // Calculate the Merkle Proof
    const proof = merkleTree.getProof(tx);
    const targetHash = tx.signature!;
    const root = merkleTree.getRoot();

    // Verify Merkle Proof
    expect(MerkleTree.verifyProof(root, proof, targetHash)).toBe(true);
  });
});