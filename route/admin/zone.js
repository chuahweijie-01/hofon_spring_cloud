const express = require('express');
const zoneController = require('../../controller/admin/zone');

router = express.Router();
router.use(express.static('./public/'));

router.get('/', zoneController.displayZoneList);
router.get('/new', zoneController.openNewZone);
router.get('/:id', zoneController.displayZone);

router.post('/', zoneController.addNewZone);

router.put('/:id', zoneController.updateZone);

router.delete('/:id', zoneController.deleteZone);

module.exports = router;