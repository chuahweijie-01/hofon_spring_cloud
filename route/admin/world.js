const express = require('express');
const world_controller = require('../../controller/admin/world');

router = express.Router();
router.use(express.static('./public/'));

router.post('/', world_controller.addNewCountry);
router.post('/:id', world_controller.addNewCity);

router.get('/', world_controller.getCountryList);
router.get('/new', world_controller.world_new);
router.get('/:id', world_controller.getCountry);

router.delete('/:id', world_controller.deleteCountry);
router.delete('/:id/city/:city_id', world_controller.deleteCity);

router.put('/:id', world_controller.updateCountry);

module.exports = router;