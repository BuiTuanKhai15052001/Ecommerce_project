'use strict';
const express = require('express');
const router = express.Router();

// router.get('/hello', (req, res, next) => {
//     return res.status(200).json({
//         message: "Hello my friend!!!",
    
//     })
// })

router.use('/v1/api', require('./access'))

module.exports = router;