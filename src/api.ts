import {AddressInfo} from 'net';
import http from 'http';
import {logger} from './logger';
import express, {Express} from 'express';
import 'dotenv/config';
import bodyParser from "body-parser";

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || '5010';

import {SmartContractPhoneBook} from "./scPhoneBook";

export class ApiServer {
    //server: http.Server;

    private async createServer(): Promise<Express> {
        const app = express();

        app.use(bodyParser.json());       // to support JSON-encoded bodies
        app.use(bodyParser.urlencoded({extended: true}));

        app.disable('x-powered-by');


        app.get('/ping', async (_req, res) => {
            const msg = {message: 'Pinged at', timestamp: Date.now()}
            logger.info(`${JSON.stringify(msg)}`);
            res.status(200).json(msg);
        });

        app.get('/entries/:name', async (_req, res) => {
            logger.info(`Getting entry for : ${_req.params.name}`);
            const entry = await SmartContractPhoneBook.getEntry(_req.params.name)
            logger.info(`Got entry for : ${_req.params.name}, entry: ${JSON.stringify(entry)}`);
            res.status(200).json(entry)
        });

        app.get('/entries', async (_req, res) => {
            const msg = "Not Implemented"
            logger.error(msg);
            res.status(401).json({error: msg})
        });
        /*
        This endpoint expects JSON in the following schema in the request post:
        {
            name: string,
            number: number
        }
         */
        app.post('/entries', async (_req, res) => {
            const entry = _req.body;
            const rec = await SmartContractPhoneBook.addEntry(entry);
            if (rec) {
                logger.info(`Entry added. Here is the record: ${JSON.stringify(rec)}`)
                res.status(200).json({message: 'Entry added', entry }).send();
            } else {
                res.status(401).json({error: "entry not processed"})
            }

        });

        return app;
    };

    public async startServer(): Promise<http.Server> {
        const app = await this.createServer();
        const server = http.createServer(app).listen({host, port}, () => {
            const addressInfo = server.address() as AddressInfo;
            logger.info(
                `PhoneBook API is ready at http://${addressInfo.address}:${addressInfo.port}`
            );
        });
        return server;
    }
}
