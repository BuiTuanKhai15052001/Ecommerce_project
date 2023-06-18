'use strict';

const JWT = require('jsonwebtoken');
const { asyncHandle } = require('../helpers/asyncHandle');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //create Token
        const accessToken = JWT.sign(payload, publicKey, {
            //  algorithm: 'RS256',
            expiresIn: '2 days'
        })
        const refreshToken = JWT.sign(payload, privateKey, {
            //    algorithm: 'RS256',
            expiresIn: '7 days'
        })
        // verify TOKEN 
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verify:::`, err);
            } else {
                console.log(`decode verify:::`, decode);
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {
        return {
            code: 'xxx',
            message: error.message,
            status: 'error createTokenPair'
        }
    }
};

const authentication = asyncHandle(async (req, res, next) => {
    /*
     check userId
     get accessToken
     verify token
     check user in dbs
     check keyStore with userId
    */

    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid Request')
    console.log(`userId:>>>>`, userId);

    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Not found keyStore')

    console.log(`keyStore:authUtil::::::>>`, keyStore);

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Invalid Request!!')


    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        console.log(`decodeUser:::>>>`, decodeUser);
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid decodeUserId')
        req.keyStore = keyStore;
        next();

    } catch (error) {
        throw error
    }
})
module.exports = {
    createTokenPair,
    authentication
}