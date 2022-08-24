import {expect} from 'chai';
import {before, describe, it} from 'mocha';
import {logger} from '../src/logger';
import {PhoneBookClient} from "../src/phoneBookClient";
import path from 'path';
import {TransactionReceipt} from "@hashgraph/sdk";
require('dotenv').config({ path: path.join(__dirname, '../', 'src','.env') })

describe('Phone Book Tests', () => {
    before(async () => {
        // tslint:disable-next-line:no-console
        logger.info(' Starting Phone Book Tests');
    });


    it('Can Create Contract', async () => {
        const receipt = await PhoneBookClient.createContract();
        expect(receipt).to.be.instanceof(TransactionReceipt)
    });

});