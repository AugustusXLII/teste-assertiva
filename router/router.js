const express = require('express');
const ClienteController = require('../controller/ClienteController');
const router = express.Router()

router.use(ClienteController);

module.exports = router;