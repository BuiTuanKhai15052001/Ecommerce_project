'use strict';

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}


class AccessService {
    static signUp = async ({ name, email, passwword }) => {
        try {
            // check email exists
            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                return {
                    code: 'xxx',
                    message: 'Shop already exists!!'
                }
            }

            const passwordHash = await bcrypt.hash(passwword, 10)
            const newShop = await shopModel.create({
                name, email, passwword: passwordHash, roles: [RoleShop.SHOP]
            })
            if (newShop) {

            }

        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error,'
            }
        }
    }
}

module.exports = AccessService;