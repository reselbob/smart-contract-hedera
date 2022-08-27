//import {expect} from 'chai';
import {expect} from "chai";
import http from 'http';

const request = require('supertest');
import {before, describe, it} from 'mocha';
import {logger} from '../src/logger';
import path from 'path';
import {faker} from '@faker-js/faker';
import {Entry} from "../src/scPhoneBook";
import {ApiServer} from "../src/api";
//import {TransactionRecord} from "@hashgraph/sdk";
require('dotenv').config({path: path.join(__dirname, '../', 'src', '.env')})

describe('Smart Contract Phone Book API Tests', () => {
    before(async () => {
        logger.info(' Starting Smart Contract Phone Book API Tests');
    });

    it('Can start Server', async () => {
        logger.info('Running can start server test');
        const server = await new ApiServer().startServer();
        expect(server).to.be.instanceof(http.Server);
    }).timeout(10000);

    it('Can add and get entry to API', async () => {
        logger.info('Running can add and get entry to API test');
        const entry: Entry = {
            name: `${faker.name.firstName()}-${faker.name.lastName()}`,
            mobileNumber: parseInt(faker.random.numeric(10))
        }
        const server = await new ApiServer().startServer();

        //post the entry
        await request(server)
            .post(`/entries/`)
            .send(entry)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);

        //post the entry
        await request(server)
            .get(`/entries/${entry.name}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect((response) => {
                const myentry = response.body;
                logger.info(myentry);
            });

    }).timeout(20000);


    //get the entry

});
