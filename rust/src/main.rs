use std::io::{BufReader, Read, Write};
use std::net::TcpStream;
use serde::{Deserialize, Serialize};
use sha2::{Sha256, Digest};

// Define the structure of a single proof item in the incoming JSON data
#[derive(Debug, Serialize, Deserialize)]
pub struct ProofItem {
  hash: String, // Hash value of the proof item
  right: bool,  // Indicates whether the hash is on the right or left in the tree
}

// Define the structure of the entire incoming JSON data
#[derive(Debug, Serialize, Deserialize)]
struct JsonData {
  root: String,         // Root hash of the Merkle tree
  proof: Vec<ProofItem>,// Vector of proof items
  target_hash: String,  // Target hash that needs verification
}

// Function to verify the Merkle proof
pub fn verify_proof(root: &str, proof: Vec<ProofItem>, target_hash: &str) -> bool {
  // Decode the target hash from hex to bytes
  let mut hash = hex::decode(target_hash).expect("Invalid hex in target hash");

  // Iterate over each proof item
  for item in proof {
    // Decode the sibling hash from hex to bytes
    let sibling_hash = hex::decode(item.hash).expect("Invalid hex in proof");
    
    // Combine the hashes based on the position (right or left)
    let combined = if item.right {
      [hash.clone(), sibling_hash].concat()
    } else {
      [sibling_hash, hash.clone()].concat()
    };

    // Compute the hash of the combined value
    hash = Sha256::digest(&combined).to_vec();
  }

  // Check if the computed hash matches the root hash
  hex::encode(&hash) == root
}

// Main function to run the client program
fn main() -> std::io::Result<()> {
  // Define the server address and port
  let server_addr = "127.0.0.1:4000";
  
  // Initialize a counter for test cases
  let mut count = 0;

  // Infinite loop to repeatedly request and verify Merkle proofs
  loop {
    // Create a TcpStream and connect to the server
    let mut stream = TcpStream::connect(server_addr)?;

    // Define the request data to send
    let request_data = "merkle-proof-request";

    // Send the request data to the TypeScript server
    stream.write_all(request_data.as_bytes())?;
    stream.flush()?;

    // Create a BufReader to read from the TcpStream
    let mut reader = BufReader::new(stream);

    // Read the result from the TypeScript server into a string
    let mut response = String::new();
    reader.read_to_string(&mut response)?;

    // Parse the JSON data received from the server
    let json_data: JsonData = serde_json::from_str(&response)
      .expect("Failed to parse JSON");

    // Verbose Merkle Proof output for debugging
    count += 1;
    println!("-------------------------- MERKLE TREE TEST {:} --------------------------", count);
    println!("Root:   {:?}", json_data.root);
    println!("Proof:");
    for item in &json_data.proof {
      println!("        {:?}", item.hash);
    }
    println!("Target: {:?}", json_data.target_hash);

    // Verify the Merkle proof
    if verify_proof(
      &json_data.root,
      json_data.proof,
      &json_data.target_hash) {
      println!("Verification succeeded\n");
    } else {
      println!("Verification failed\n");
    }
  }
}