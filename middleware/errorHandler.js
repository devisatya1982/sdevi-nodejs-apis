import  { logEvents } from './logEvents.js';

const errorHandler = async(err, req, res, next) => {
    await logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack)
    res.status(500).send(err.message);
}

export default errorHandler;