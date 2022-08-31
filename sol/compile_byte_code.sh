#!/usr/env bash

BINARY_DIR="./bin";

# if the ./bin directory exists delete it
if [ -d "$BINARY_DIR" ]; then rm -Rf $BINARY_DIR; fi

# compile the file PhoneBookContract.sol to the ./bin directory

echo "Starting the smart contract compilation process."

solcjs --bin ./PhoneBookContract.sol -o $BINARY_DIR

echo "Finished the smart contract compilation process."

