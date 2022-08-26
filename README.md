# smart-contract-hedera
The project demonstrates how to create a smart contract under Hedera that stores mobile phone numbers according to a name.

In order to use this code you need to have a [TestNet](https://docs.hedera.com/guides/testnet) account. When you create a TestNet account you'll be given an `Account ID` and a `Private Key`. You'll 
declare these values in environment variables. Environment variable configuration is discussed in a section below.

The project contains code for a static class named `SmartContractPhoneBook`. The class `SmartContractPhoneBook` exposes two methods:

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

You'll get output similar to the following:

```
 Smart Contract Phone Book Tests
{
  message: ' Starting Smart Contract Phone Book Tests',
  level: 'info',
  timestamp: '2022-08-26T05:25:06.037Z'
}
{
  message: 'Creating entry: {"name":"Jaunita-Tremblay","mobileNumber":2103588668}',
  level: 'info',
  timestamp: '2022-08-26T05:25:06.040Z'
}
{
  message: 'The smart contract ID is: 0000000000000000000000000000000002dc9713',
  level: 'info',
  timestamp: '2022-08-26T05:25:09.744Z'
}
{
  message: 'The smart contract address is: 0.0.48011027',
  level: 'info',
  timestamp: '2022-08-26T05:25:09.744Z'
}
{
  message: 'Getting entry for Jaunita-Tremblay',
  level: 'info',
  timestamp: '2022-08-26T05:25:11.580Z'
}
{
  message: "- Here's the phone number associated with Jaunita-Tremblay: 2103588668",
  level: 'info',
  timestamp: '2022-08-26T05:25:11.703Z'
}
    ✔ Can add and get entry (5663ms)


  1 passing (6s)

```
