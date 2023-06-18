'use strict';

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const  keyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}


class AccessService {

    static logout = async (keyStore) => {
        const delKey = await keyTokenService.removeKeyById(keyStore._id)
        if (!delKey) throw new NotFoundError('Not found delKey')
        return delKey
    }

    /*
    1. check email
    2. match password
    3. create accessToken and refreshToken
    4. general token
    5. getdata ---> return Login
    */

    static login = async ({ email, password, refreshToken = null }) => {
        //1. check email
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new BadRequestError('Shop not register')
        //2. match password
        const matchPass = bcrypt.compare(password, foundShop.password);
        if (!matchPass) throw new AuthFailureError('Authentication Error')
        //3.create accessToken and refreshToken
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');
        const { _id: userId } = foundShop;
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);
        await keyTokenService.createKeyToken({
            userId,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        })

        return {
            shop: getInfoData({ fields: ['_id' ,'name', 'email'], object: foundShop }),
            tokens,
            message: 'Login success'
        }




    }

    static signUp = async ({ name, email, password }) => {
        //   try {
        // check email exists
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new BadRequestError('Error: Shop already register!')
        }

        const passwordHash = await bcrypt.hash(password, 10)


        const newShop = new shopModel({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP]
        })
        const savenewShop = await newShop.save();
        if (!savenewShop) {
            return {
                code: 200,
                metadata: null
            }
        }

        if (savenewShop) {
            //  create privateKey, publicKey
            // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            //     modulusLength: 4096,
            //     publicKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem'
            //     },
            //     privateKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem'
            //     }
            // })
            //   console.log({ privateKey.toString('base64'), publicKey }); // save collection keyStore
            // Prints asymmetric key pair after encoding
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');
            // console.log(`>>>>>>>>>publicKeyString::`, publicKeyString);
            // const publicKeyObject = await crypto.createPublicKey(publicKeyString);

            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            console.log(`Created Token Success:::`, tokens);
            const keyStore = await keyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken
            });

            if (!keyStore) {
                return {
                    code: 'xxxx',
                    message: 'keyStore error',
                }
            }

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({ fields: ['_id', 'name', 'email'], object: savenewShop }),
                    tokens
                }
            }
        }

        // } catch (error) {
        //     return {
        //         code: 'xxx',
        //         message: error.message,
        //         status: 'error,'
        //     }
        // }
    }
}

module.exports = AccessService;