import {ApiServer} from "./api";
import {logger} from "./logger";

require("dotenv").config();

new ApiServer().startServer().then(r => {
    logger.info('started server')
});
