import {AddressInfo} from 'net';
import http from 'http';
import {logger} from './logger';
import express from 'express';
import 'dotenv/config';
import bodyParser from "body-parser";

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || '5010';

const createServer = (): express.Application => {
    const app = express();

    app.use( bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({ extended: true }));

    app.disable('x-powered-by');
    app.get('/entries/:name', async (_req, res) => {
        const msg = "Not Implemented"
        logger.error(msg);
        res.status(401).json({error: msg})
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

        res.status(200).json({message: 'Accepted post but endpoint not implemented', response: res})

    });

    return app;
};
// make the server available for export

let server: any;

async function startServer() {
    const app = createServer();
    server = http.createServer(app).listen({host, port}, () => {
        const addressInfo = server.address() as AddressInfo;
        logger.info(
            `PhoneBook API is ready at http://${addressInfo.address}:${addressInfo.port}`
        );
    });
    return server;
}

startServer().then(() => logger.info('startServer called for Reselcoin API'));

module.exports = server;
