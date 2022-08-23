import {expect} from 'chai';
import {before, describe, it} from 'mocha';
import {logger} from '../src/logger';
import {PhoneBookClient} from "../src/phoneBookClient";
import path from 'path';
require('dotenv').config({ path: path.join(__dirname, '../', 'src','.env') })

describe('Solidity Test', () => {
    before(async () => {
        // tslint:disable-next-line:no-console
        logger.info('starting Solidity Test');
    });


    it('Can Get ByteCodePath', async () => {
        const client = new PhoneBookClient();
        const fileSpec = client.getContractByteCodeFileSpec();
        expect(fileSpec).to.be.a('string');
    });

    it('Can Get ByteCode', async () => {
        const client = new PhoneBookClient();
        const fileSpec = client.getContractByteCodeFileSpec();
        expect(fileSpec).to.be.a('string');
    });
});
