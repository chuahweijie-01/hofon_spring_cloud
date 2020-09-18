const express = require('express');
const ads_controller = require('../../controller/admin/ads');
const ads_validation = require('../../middleware/admin/ads_validation');

router = express.Router();
router.use(express.static('./public/'));

router.post('/', ads_validation.ads_info_input, ads_controller.ads_create)

router.get('/new', ads_controller.ads_new);
router.get('/', ads_controller.ads_display_list);
router.get('/:id', ads_controller.ads_display)

router.put('/:id', ads_validation.ads_info_input, ads_controller.ads_update)

router.delete('/:id', ads_controller.ads_delete)

module.exports = router;