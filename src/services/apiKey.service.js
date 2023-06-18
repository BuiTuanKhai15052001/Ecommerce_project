'use strict';
const apiKeyModel = require('../models/apiKey.model')
const crypto = require('crypto')

const findById = async(key) => {
    // const newKey = await apiKeyModel.create({key: crypto.randomBytes(64).toString('hex'), permissions: ['1111']});
    // console.log(newKey)
    const objKey = await apiKeyModel.findOne({key, status: true}).lean()
    console.log(`ObjKEy>>>>>>>>>>::::`,objKey);
    return objKey
}

module.exports = {
    findById
}