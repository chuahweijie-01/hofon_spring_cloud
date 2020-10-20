const express = require('express');
const zoneController = require('../../controller/admin/zone');

router = express.Router();
router.use(express.static('./public/'));

router.get('/', zoneController.displayZoneList);

module.exports = router;