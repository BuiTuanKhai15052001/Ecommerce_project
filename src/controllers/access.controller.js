'use strict';
const AccessService = require('../services/access.service')
const { OK, CREATED } = require('../core/success.response')
class AccessController {

    logout = async (req, res, next) => {
        new OK({
            message: 'Logout success',
            metadata: await AccessService.logout(req.keyStore)
           }).send(res)

    }

    signUp = async (req, res, next) => {

        console.log(`[P]::signUp::`, req.body);
        /*
        200  OK
        201 CREATED           
        */
        new CREATED({
            message: 'Registers OK!',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }

    signIn = async (req, res, next) => {
        console.log(`[P]::signIn::`, req.body);
        /*
        signIn: 200 OK
        */
       new OK({
        message: 'Login success',
        metadata: await AccessService.login(req.body)
       }).send(res)
    }
}

module.exports = new AccessController();