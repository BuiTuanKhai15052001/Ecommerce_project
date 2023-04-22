'use strict';
const mongoose = require('mongoose');
const os = require('node:os');
const process = require('process');
const _SECONDS = 5000;
// const process = require()

//count connect..
const countConnect = () => {
    const numConnects = mongoose.connections.length;
    console.log(`Number of connect: ${numConnects}`)   
}


//check overload

const checkOverload = () => {
    setInterval(
        () => {
            const numConnection = mongoose.connections.length;
            const numCores = os.cpus().length;   
            // console.log(os.cpus());
            const memoryUsage = process.memoryUsage().rss;

            // Example maximum number of connections
            const maxConnections = numCores * 5;
            console.log(`Maxconnections is: ${maxConnections}`);
            console.log(`Active connection:${numConnection}`);
            console.log(`Memory usage:: ${memoryUsage / 1024 / 1024}MB`);

            if (numConnection > maxConnections) {
                console.log(`Connection overload detected`)
            }

        }, _SECONDS)  //Monitor every 5 seconds
}

module.exports = { countConnect, checkOverload };