import * as net from 'net';
import Block from './block';
import MerkleTree from './merkle-tree';

// Define the port and host for the TCP server
const PORT = 4000;
const HOST = '127.0.0.1';

// Create a TCP server
const server = net.createServer((socket) => {
  console.log('Client connected');

  // Handle incoming data from Rust client
  socket.on('data', (data) => {
    const receivedData = data.toString().trim(); // Convert the received data to a string and trim whitespace
    console.log('Received a request from client:', receivedData);

    // Create a new Block object and populate it with test transactions
    let block = new Block();
    block.createTestBlock();

    // Create a Merkle Tree from the block
    let merkleTree = new MerkleTree(block);

    // Check if the Merkle Tree has a root
    if (merkleTree.getRoot() == null) {
      console.log("Merkle Tree doesn't have a root");
    } else {
      // Choose a random index for a transaction in the block
      let index = Math.floor(block.getTransactionNum() * Math.random());

      // Retrieve the transaction at the chosen index
      const tx = block.getTransactions()[index];

      // Calculate the Merkle Proof (proof, target hash, root) for the chosen transaction
      const proof = merkleTree.getProof(tx);
      const targetHash = tx.signature!;
      const root = merkleTree.getRoot();

      // Verify the Merkle Proof
      if (MerkleTree.verifyProof(root, proof, targetHash)) {
        console.log("Verification succeeded");
      } else {
        console.log("Verification failed");
      }

      // Define the JSON data to send to the client
      const jsonData = {
        root,
        proof,
        target_hash: targetHash
      };

      // Send the JSON data as a string
      socket.write(JSON.stringify(jsonData), () => {
        console.log('Merkle Proof sent to Rust client');
        socket.end(); // Close the connection after sending the data
      });
    }
  });

  // Handle client disconnection
  socket.on('end', () => {
    console.log('Client disconnected\n');
  });
});

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`Merkle Proof server listening on ${HOST}:${PORT}`);
});