'use strict';

//level 0
// const config = {
//    _DB:{
//         port: 3000
//     },
//     db:{
//         host:'127.0.0.1',
//         port: 27017,
//         name: 'db'
//     }
// }
// level 1
const dev = {
_DB:{
        port: process.env.DEV_APP_PORT || 2001
    },
    db:{
        host:process.env.DEV_DB_HOST || '127.0.0.1',
        port: process.env.DEV_DB_PORT|| 27017,
        name: process.env.DEV_DB_NAME || 'shopDEV',
    }
}


const pro = {
_DB:{
        port: process.env.PRO_APP_PORT || 3000
    },
    db:{
        host:process.env.PRO_DB_HOST || '127.0.0.1' ,
        port:process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'shopPRO'
    }
}

const config = {dev, pro};
const env = process.env.NODE_ENV || 'dev';
console.log(config[env], env);

module.exports = config[env];

