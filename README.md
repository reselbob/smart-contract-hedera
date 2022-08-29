# smart-contract-hedera
The project demonstrates how to create a smart contract under Hedera that stores mobile phone numbers according to a name.

In order to use this code you need to have a [TestNet](https://docs.hedera.com/guides/testnet) account. When you create a TestNet account you'll be given an `Account ID` and a `Private Key`. You'll 
declare these values in environment variables. Environment variable configuration is discussed in a section below.

## Understanding the Smart Contract PhoneBook API

The project ships with an RESTful API that you can use to add and retrieve phonebook entry against the underlying Smart Contract.

The API endpoints are:

```
POST http://127.0.0.1:5010/entries
GET http://127.0.0.1:5010/entries/:name
```

The structure of the request body when doing a POST of an entry is:

```JSON
{
  "name": "John01",
  "mobileNumber": 3101021234
}

```

The following is am example of a POST command executed against the API using `curl`:

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name":"John01","mobileNumber":3101021234}' \
   http://127.0.0.1:5010/entries
```

You'll get output as follows:

```JSON
{"message":"Entry added","entry":{"name":"John01","mobileNumber":3101021234}}
```

The following is am example of a GET command executed against the API using `curl` to retrieve a `mobilePhoneNumber`:

```
curl http://127.0.0.1:5010/entries/John01
```

You'll get output as follows:

```JSON
{"name":"John01","mobileNumber":3101021234}
```


Deploying and using the API is described in the section **Deploying and Using the Smart Contract PhoneBook API** that you'll find below.

## Understanding the TypeScript Object Model

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

Then, install the Solidity compiler:

`sudo npm install -g solc`


## Configuring the required environment variables

You can declare environment variables in a `.env` file placed in the `./src` directory. Configure the `.env` file like so:

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

The unit tests for this project use Account ID and Private key information you attached to the environment variables that you defined previously in the `./src/env` file. Thus, you need to copy the `env` file to the `./tests` directory. 

Run the following command from the root of the source codes working directory to copy the configured `.env` file to the `./tests` directory:

```
cp ./src/.env ./tests/.env
```

Execute the following command to run the projects unit tests:

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

## Deploying and Using the Smart Contract PhoneBook API

`Step 1:` Make sure the file `./src/.env` is properly configured as described above.

---

`Step 2:` Navigate to the directory named `./sol` 

```
cd col
```

---

`Step 3:` Execute the bash script `compile_byte_code.sh`

```
sh ompile_byte_code.sh

```

---

`Step 4:` Navigate up to the root of the project's source code directory

```
cd ..
```

---

`Step 5:` Execute the bash script `deloy.sh`. The bash script will compile the TypeScript code into JavaScript and put the JavaScript files in t
the directory named `dist`. Also, the script copies the `.env` file to the compilation directory named `dist`. Finally, the script
will start the API server.

---

`Step 6:` Once the API Server starts run the following command to ping the server:

```
curl http://127.0.0.1:5010/ping
```

You'll get output similar to the following:

`{"message":"Pinged at","timestamp":1661567707424}%`
