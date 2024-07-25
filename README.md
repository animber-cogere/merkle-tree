# Merkle Tree and Hashing Algorithms

## Overview
The objective of this project is to implement a simple Merkle tree and demonstrate its usage. This includes building the tree from a list of transactions, applying a hashing algorithm (e.g., SHA-256) to the nodes of the tree, verifying the inclusion of a transaction using a Merkle proof, and ensuring the correctness of the implementation through tests.

## Table of Contents
- [Features](#features)
- [Communication via TCP Socket](#communication-via-tcp-socket)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)l
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Build the Project](#build-the-project)
- [Instructions](#usage)
  - [Install TypeScript Dependencies](#install-typescript-dependencies)
  - [Run the Unit Tests](#run-the-unit-tests)
  - [Run Merkle Proof Server](#run-merkle-proof-server)
  - [Run the Rust Program](#run-the-rust-program)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- Build a Merkle tree from a list of transactions (address and amount)
  - To avoid ambiguities in the tree structure and proofs, incorporate additional timestamp into each transaction
- Apply SHA-256 hashing algorithm for the nodes of the **Merkle Tree**
- Verify the inclusion of a transaction using a **Merkle Proof** in TypeScript
- Verify the correctness of a **Merkle Proof** in the client(Rust)
- Comprehensive tests to verify the correctness of the implementation
- **Merkle Proof Server** sends **Merkle Proof** to the client and client verifies its correctness independently.

## Communication via TCP Socket
**Merkle Proof Server** listens on localhost:4000. When **Rust Client** requests **Merkle Proof** data from the server, **Merkle Proof Server** sends **Merkle Proof** data to the client via TCP socket. Once the client receives it, it verifies data correctness.

## Prerequisites
- [**Node.js** and **npm**](https://github.com/nvm-sh/nvm)
- [**Rust** and **Cargo**](https://www.rust-lang.org/tools/install)

## Getting Started

### Clone the repository

```sh
git clone https://github.com/animber1/merkle-tree.git
cd merkle-tree
```

## Instructions
### Install TypeScript Dependencies

```sh
cd typescript
npm install
```

### Run the Unit Tests
    
```sh
npm test
```
    
### Run Merkle Proof Server
    
```sh
npm start
```

Please note that **Merkle Proof Server** is listening on localhost:4000.

### Run the Rust Client

Open another terminal and run **Rust Client**.

```sh
cd ${PROJECT_DIR}/rust
cargo run
```

## License
This project is licensed under the MIT License.

## Acknowledgments
Special thanks to the Rust and Solana community for their support and documentation.

Feel free to customize the content to better fit your project's specifics and personal preferences.
