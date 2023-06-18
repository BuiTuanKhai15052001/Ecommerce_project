'use strict';
const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router();

const {asyncHandle} = require('../../helpers/asyncHandle')
const { authentication } = require('../../auth/authUtils') 

//handle Error


//signUp
router.post('/shop/signup', asyncHandle(accessController.signUp))
//login
router.post('/shop/login', asyncHandle(accessController.signIn))


//authentication
router.use(authentication)
///////////

//logout
router.post('/shop/logout', asyncHandle(accessController.logout))


module.exports = router;