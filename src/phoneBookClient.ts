import NodeClient from "@hashgraph/sdk/lib/client/NodeClient";

require("dotenv").config();
import {logger} from './logger';
import fs from 'fs';
import path from 'path';
import {
    AccountId,
    ContractCallQuery,
    ContractCreateTransaction, ContractExecuteTransaction,
    ContractFunctionParameters,
    FileCreateTransaction, PrivateKey,
    TransactionReceipt,
} from "@hashgraph/sdk";
import {BigNumber} from "@hashgraph/sdk/lib/Transfer";
//import Node from "@hashgraph/sdk/lib/Node";


const {
    //AccountId,
   // PrivateKey,
    Client,
    //FileCreateTransaction,
    //ContractCreateTransaction,
   // ContractFunctionParameters,
    //ContractExecuteTransaction,
    //ContractCallQuery,
    //Hbar,
} = require("@hashgraph/sdk");

export interface PhoneBookEntry {
    contractId: string;
    name: string;
    phoneNumber: BigNumber;
}

export class PhoneBookClient {
    static fileId:string;
    static operatorId: string;
    static operatorKey: string;
    static client: NodeClient;
    static contractBytecode: Buffer;

/*    constructor() {
        if(! process.env.OPERATOR_ID)throw new Error('The required environment variable OPERATOR_ID is not set.')
        if(! process.env.OPERATOR_PVKEY)throw new Error('The required environment variable OPERATOR_PVKEY is not set.')

        this.operatorId = process.env.OPERATOR_ID;
        this.operatorKey = process.env.OPERATOR_PVKEY;
        this.client = Client.forTestnet().setOperator(this.operatorId, this.operatorKey);
    }*/
    public static getContractByteCodeFileSpec(): string{
        const fileSpec = path.join(__dirname,'..','sol/bin/PhoneBookContract_sol_PhoneBookContract.bin');
        logger.info(`Got filespec: ${fileSpec}`)
        return fileSpec;
    }

    public static getOperatorId(): AccountId {
        if(! process.env.OPERATOR_ID)throw new Error('The required environment variable OPERATOR_ID is not set.')
        return AccountId.fromString(process.env.OPERATOR_ID);
    }

    private static getOperatorKey(): PrivateKey {
        if(! process.env.OPERATOR_PVKEY)throw new Error('The required environment variable OPERATOR_PVKEY is not set.')
        return PrivateKey.fromString(process.env.OPERATOR_PVKEY);
    }


    public static getClientSync(): NodeClient{
        if( ! PhoneBookClient.client) {
            PhoneBookClient.client = Client.forTestnet().setOperator(PhoneBookClient.getOperatorId(), PhoneBookClient.getOperatorKey());
        }
        return PhoneBookClient.client;
    }

    public static getContractByteCode() {
        return fs.readFileSync(PhoneBookClient.getContractByteCodeFileSpec());
    }

    public static async createContract(): Promise<TransactionReceipt> {
        const client = PhoneBookClient.getClientSync();
        logger.info('Getting Transaction Receipt')
        if(! PhoneBookClient.fileId){
            PhoneBookClient.fileId = await PhoneBookClient.getFileId(client);
        }
        const contractInstantiateTx = new ContractCreateTransaction()
            .setBytecodeFileId(PhoneBookClient.fileId)
            .setGas(100000)
        const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
        let contractInstantiateRx: TransactionReceipt;
        try {
            contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
        } catch (e) {
            logger.error(e);
        }
        logger.info(`Got Transaction - contractId: ${contractInstantiateRx.contractId},  
            The smart contract ID in Solidity format is: ${contractInstantiateRx.contractId.toSolidityAddress()} `)
        return contractInstantiateRx;
    }

    private static async getFileId(client: NodeClient):Promise<any> {;
        this.contractBytecode = fs.readFileSync(this.getContractByteCodeFileSpec());
        const fileCreateTx = new FileCreateTransaction()
            .setContents(this.contractBytecode)
            .setKeys([PhoneBookClient.getOperatorKey()])
            .freezeWith(client);
        const fileCreateSign = await fileCreateTx.sign(PhoneBookClient.getOperatorKey());
        const fileCreateSubmit = await fileCreateSign.execute(client);
        const fileCreateRx = await fileCreateSubmit.getReceipt(client);
        return fileCreateRx.fileId;
    }

    public static async getPhoneNumber(client: NodeClient, contractId: string, name: string): Promise<BigNumber>{
        const contractQueryTx = new ContractCallQuery()
            .setContractId(contractId)
            .setGas(100000)
            .setFunction("getMobileNumber", new ContractFunctionParameters().addString("Alice"));
        const contractQuerySubmit = await contractQueryTx.execute(client);
       return contractQuerySubmit.getUint256(0);
    }

    public static async setPhoneBookEntry(client: NodeClient, entry: PhoneBookEntry): Promise<TransactionReceipt> {
        logger.info(`Setting phone book entry for ${entry}`)
        const contractExecuteTx = new ContractExecuteTransaction()
            .setContractId(entry.contractId)
            .setGas(100000)
            .setFunction(
                "setMobileNumber",
                new ContractFunctionParameters().addString(entry.name).addUint256(entry.phoneNumber)
            );
        const contractExecuteSubmit = await contractExecuteTx.execute(client);
        const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
        logger.info(`Got Transaction - contractId: ${contractExecuteRx.contractId},  
            The smart contract ID in Solidity format is: ${contractExecuteRx.contractId.toSolidityAddress()} `)
        logger.info(`The scheduled transactionId is ${contractExecuteRx.scheduledTransactionId}`)
        logger.info(`The transaction status is ${contractExecuteRx.status}`)
        return contractExecuteRx;
    }
}

/*
// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
    // Import the compiled contract bytecode
    const contractBytecode = fs.readFileSync("./bin/LookupContract_sol_LookupContract.bin");

    // Create a file on Hedera and store the bytecode
    const fileCreateTx = new FileCreateTransaction()
        .setContents(contractBytecode)
        .setKeys([operatorKey])
        .freezeWith(client);
    const fileCreateSign = await fileCreateTx.sign(operatorKey);
    const fileCreateSubmit = await fileCreateSign.execute(client);
    const fileCreateRx = await fileCreateSubmit.getReceipt(client);
    const bytecodeFileId = fileCreateRx.fileId;
    console.log(`- The bytecode file ID is: ${bytecodeFileId} \n`);

    // Instantiate the smart contract
    const contractInstantiateTx = new ContractCreateTransaction()
        .setBytecodeFileId(bytecodeFileId)
        .setGas(100000)
        .setConstructorParameters(
            new ContractFunctionParameters().addString("Alice").addUint256(111111)
        );
    const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
    const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
    const contractId = contractInstantiateRx.contractId;
    const contractAddress = contractId.toSolidityAddress();
    console.log(`- The smart contract ID is: ${contractId} \n`);
    console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);

    // Query the contract to check changes in state variable
    const contractQueryTx = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getMobileNumber", new ContractFunctionParameters().addString("Alice"));
    const contractQuerySubmit = await contractQueryTx.execute(client);
    const contractQueryResult = contractQuerySubmit.getUint256(0);
    console.log(`- Here's the phone number that you asked for: ${contractQueryResult} \n`);

    // Call contract function to update the state variable
    const contractExecuteTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction(
            "setMobileNumber",
            new ContractFunctionParameters().addString("Bob").addUint256(222222)
        );
    const contractExecuteSubmit = await contractExecuteTx.execute(client);
    const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
    console.log(`- Contract function call status: ${contractExecuteRx.status} \n`);

    // Query the contract to check changes in state variable
    const contractQueryTx1 = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getMobileNumber", new ContractFunctionParameters().addString("Bob"));
    const contractQuerySubmit1 = await contractQueryTx1.execute(client);
    const contractQueryResult1 = contractQuerySubmit1.getUint256(0);
    console.log(`- Here's the phone number that you asked for: ${contractQueryResult1} \n`);
}
main();*/
