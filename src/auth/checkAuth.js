'use strict';
const HEADER ={
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const { findById } = require('../services/apiKey.service')

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: "Not ApiKey Error"
            })
        }
        //when have key...
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: "Forbidden error"
            })
        }
        req.objKey = objKey
        next();

    } catch (error) {
        next(error)
    }
}


const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: "Permission denie"
            })
        }

        console.log(`permissions::::::`, req.objKey.permissions);

        const isValidPermission = req.objKey.permissions.includes(permission);
        if (!isValidPermission) {
            return res.status(403).json({
                message: "Permission denie"
            })
        }

        return next()
    }
}




module.exports = {
    apiKey,
    permission,
    
}
