const express = require('express');
const zoneController = require('../../controller/admin/zone');
const zoneValidation = require('../../middleware/admin/zone_validation');

router = express.Router();
router.use(express.static('./public/'));

router.get('/', zoneController.getZoneList);
router.get('/new', zoneController.openNewZone);
router.get('/:id', zoneController.getZone);

router.post('/', zoneValidation.zoneInputValidation, zoneController.addNewZone);

router.put('/:id', zoneValidation.zoneInputValidation, zoneController.updateZone);

router.delete('/:id', zoneController.deleteZone);

module.exports = router;