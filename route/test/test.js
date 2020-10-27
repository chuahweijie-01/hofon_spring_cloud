const express = require('express');
const testController = require('../../controller/test/test');

router = express.Router();
router.use(express.static('./public/'));

router.delete('/', testController.deleteAPI);

module.exports = router;