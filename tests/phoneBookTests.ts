import {expect} from 'chai';
import {before, describe, it} from 'mocha';
import {logger} from '../src/logger';
import path from 'path';
import { faker } from '@faker-js/faker';
import {Entry, SmartContractPhoneBook} from "../src/scPhoneBook";
import {TransactionRecord} from "@hashgraph/sdk";
require('dotenv').config({ path: path.join(__dirname, '../', 'src','.env') })

describe('Smart Contract Phone Book Tests', () => {
    before(async () => {
        // tslint:disable-next-line:no-console
        logger.info(' Starting Smart Contract Phone Book Tests');
    });


    it('Can add and get entry', async () => {
        const entry: Entry = {name: `${faker.name.firstName()}-${faker.name.lastName()}`, mobileNumber: parseInt(faker.random.numeric(10))}
        const result = await SmartContractPhoneBook.addEntry(entry)
        expect(result).to.be.instanceof(TransactionRecord);
        const retrn = await SmartContractPhoneBook.getEntry(entry.name)
        expect(entry.mobileNumber).to.be.eq(retrn.mobileNumber);
    }).timeout(10000);

});
