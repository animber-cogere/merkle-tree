import { createHash } from 'crypto';

// Convert a hexadecimal string to a byte array
function hexToByteArray(hexString: string): Uint8Array {
  // Ensure the hex string has an even length
  if (hexString.length % 2 !== 0) {
      throw new Error("Hex string must have an even length");
  }

  // Create a Uint8Array to hold the byte values
  const byteArray = new Uint8Array(hexString.length / 2);

  // Iterate over the hex string, converting each pair of hex characters to a byte
  for (let i = 0; i < hexString.length; i += 2) {
      byteArray[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }

  // Return the resulting byte array
  return byteArray;
}

// Create a SHA-256 hash of the input data
export const getHash = (data: string, hex: boolean = true): string => {
  // Convert the input data to a byte array if it is a hex string
  let data_ = hex ? hexToByteArray(data) : data;

  // Create a SHA-256 hash of the input data and return it as a hex string
  return createHash('sha256').update(data_).digest('hex');
}