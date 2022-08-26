# smart-contract-hedera
The project demonstrates how to create a smart contract under Hedera that stores mobile phone numbers according to a name.

In order to use this code you need to have a [TestNet](https://docs.hedera.com/guides/testnet) account. When you create a TestNet account you'll be given an `Account ID` and a `Private Key`. You'll 
declare these values in environment variables. Environment variable configuration is discussed in a section below.

The project contains code for a static class named `SmartContractPhoneBook`. The class `SmartContractPhoneBook` exposes to methods:

* `SmartContractPhoneBook.addEntry(entry: Entry)`
* `SmartContractPhoneBook.getEntry(name: string)`

Here is code that will create an entry:

```javascript
const entry: Entry = {name: 'Harry', mobileNumber: 1112223333}
const result = await SmartContractPhoneBook.addEntry(entry)
```

Here is code that will get an entry:

```javascript
const entry = await SmartContractPhoneBook.getEntry('Harry')
```

## Installation

`git clone https://github.com/reselbob/smart-contract-hedera.git`

`cd smart-contract-hedera`

`npm install`

Then, install the solidity compiler:

`sudo npm install -g solc`


## Configuring the required environment variables

You can declare environment variables in a `.env` file placed in the `./sol` directory. Configure the `.env` file like so:

```
OPERATOR_ID=<ACCOUNT_ID_FROM_TESTNET>
OPERATOR_PVKEY=<PRIVATE_KEY_FROM_TESTNET>
```

Or, you can `export` the environment variables, like so:

```bash
export OPERATOR_ID=<ACCOUNT_ID_FROM_TESTNET>
export OPERATOR_PVKEY=<PRIVATE_KEY_FROM_TESTNET>

```

## Creating the smart contract binary

From with the project's working directory:

```
cd ./sol

sh compile_byte_code.sh
```

The smart contract binary will be in the `./bin` directory created by the shell script. The name of the binary file is 
`PhoneBookContract_sol_PhoneBookContract.bin`

## Running the tests

`npm test`
