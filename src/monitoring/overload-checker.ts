import * as mongoose from 'mongoose';
import * as os from 'os';

const _SECONDS = 1000;

function checkOverload (){
    setInterval(() => {
        const numOfConnections = mongoose.connection.getClient.length;
        const numOfCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
        const maxConnections = numOfCores * 2;

        console.error(`Memory usage: ${memoryUsage}`);
        if(numOfConnections > maxConnections){
            console.error(`Number of connections (${numOfConnections}) is greater than the number of cores (${numOfCores})`);
            console.error(`Memory usage: ${memoryUsage}`);
            console.error(`Max connections: ${maxConnections}`);
        }
    }, 20 * _SECONDS); //check overload each 20 seconds
}

export default checkOverload;
