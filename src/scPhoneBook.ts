import path from "path";
import fs from "fs";
import NodeClient from "@hashgraph/sdk/lib/client/NodeClient";
import {logger} from './logger';
import {TransactionRecord} from "@hashgraph/sdk";

require("dotenv").config();

const {
    AccountId,
    PrivateKey,
    Client,
    FileCreateTransaction,
    ContractCreateTransaction,
    ContractFunctionParameters,
    ContractExecuteTransaction,
    ContractCallQuery,
} = require("@hashgraph/sdk");

export interface Entry {
    name: string;
    mobileNumber: number;
}


export class SmartContractPhoneBook {
    private static operatorId: string;
    private static operatorKey: string;
    private static client: NodeClient
    private static binFilePath: string;
    private static contractId: string;
    private static contractBytecode: Buffer

    constructor() {

    }

    private static init() {
        // Configure accounts and client
        if (!process.env.OPERATOR_ID) throw new Error('The required environment variable OPERATOR_ID is not set.')
        if (!process.env.OPERATOR_PVKEY) throw new Error('The required environment variable OPERATOR_PVKEY is not set.')

        this.operatorId = AccountId.fromString(process.env.OPERATOR_ID);
        this.operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);
        this.client = Client.forTestnet().setOperator(this.operatorId, this.operatorKey);
        this.binFilePath = path.join(__dirname, '..', 'sol/bin/PhoneBookContract_sol_PhoneBookContract.bin');
        this.contractBytecode = fs.readFileSync(this.binFilePath);
    }

    private static async getContractId(): Promise<string> {
        if (!this.contractId) {
            this.init();

            // Create a file on Hedera and store the bytecode
            const fileCreateTx = await new FileCreateTransaction()
                .setContents(this.contractBytecode)
                .setKeys([this.operatorKey])
                .freezeWith(this.client);
            const fileCreateSign = await fileCreateTx.sign(this.operatorKey);
            const fileCreateSubmit = await fileCreateSign.execute(this.client);
            const fileCreateRx = await fileCreateSubmit.getReceipt(this.client);
            const bytecodeFileId = fileCreateRx.fileId;

            const contractInstantiateTx = new ContractCreateTransaction()
                .setBytecodeFileId(bytecodeFileId)
                .setGas(100000);
            const contractInstantiateSubmit = await contractInstantiateTx.execute(this.client);
            let contractInstantiateRx: any;
            try {
                contractInstantiateRx = await contractInstantiateSubmit.getReceipt(this.client);
            } catch (e) {
                logger.error(e)
            }
            logger.info(`The smart contract ID is: ${contractInstantiateRx.contractId.toSolidityAddress()}`);
            logger.info(`The smart contract address is: ${contractInstantiateRx.contractId}`);

            this.contractId = contractInstantiateRx.contractId;
        }

        return this.contractId.toString();

    }

    public static async addEntry(entry: Entry): Promise<TransactionRecord> {
        logger.info(`Creating entry: ${JSON.stringify(entry)}`)
        const contractId = await this.getContractId()

        // Call contract function to update the state variable
        const contractExecuteTx = new ContractExecuteTransaction()
            .setContractId(contractId)
            .setGas(100000)
            .setFunction(
                "setMobileNumber",
                new ContractFunctionParameters().addString(entry.name).addUint256(entry.mobileNumber)
            );
        const contractExecuteSubmit = await contractExecuteTx.execute(this.client);
        return await contractExecuteSubmit.getRecord(this.client);
    }

    public static async getEntry(name: string): Promise<Entry> {
        logger.info(`Getting entry for ${name}`)
        const contractId = await this.getContractId()
            .catch(e => {
                logger.error(e)
            })
        // Query the contract to check changes in state variable
        const contractQueryTx = new ContractCallQuery()
            .setContractId(contractId)
            .setGas(100000)
            .setFunction("getMobileNumber", new ContractFunctionParameters().addString(name));
        const contractQuerySubmit = await contractQueryTx.execute(this.client)
            .catch(e => {
                logger.error(e);
            });
        const contractQueryResult = contractQuerySubmit.getUint256(0);

        logger.info(`- Here's the phone number associated with ${name}: ${contractQueryResult.toNumber()}`)

        return {name, mobileNumber: contractQueryResult.toNumber()}
    }
}

