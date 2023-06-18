'use strict';
const keytokenModel = require('../models/keytoken.model');
const {Types: {ObjectId}} = require('mongoose')

class keyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken}) => {
        try {

            /**/
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            // return tokens ? tokens.publicKey : null
            const filter = {user: userId};
            const update = {publicKey, privateKey, refreshTokensUsed: [], refreshToken};
            const option = {upsert: true, new: true}
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, option)
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error;
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({user: new ObjectId(userId)}).lean()
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({ _id: new ObjectId(id) })
    }
}


module.exports = keyTokenService