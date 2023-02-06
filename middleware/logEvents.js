import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(process.cwd(), '..', 'logs'))) {
            await fsPromises.mkdir(path.join(process.cwd(), '..', 'logs'));
        }

        await fsPromises.appendFile(path.join(process.cwd(), '..', 'logs', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

const logger = async(req, res, next) => {
    await logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}

export { logger, logEvents };
