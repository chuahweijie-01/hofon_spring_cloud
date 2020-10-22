const express = require('express');
const ads_controller = require('../../controller/admin/ads');
const ads_validation = require('../../middleware/admin/ads_validation');
const privilegesValidation = require('../../middleware/admin/privilegesValidation');

router = express.Router();
router.use(express.static('./public/'));

router.use(privilegesValidation.privilegesCheck("8"));

router.post('/', ads_controller.upload_ads_image, ads_validation.ads_info_input, ads_controller.addNewAds)

router.get('/new', ads_controller.ads_new);
router.get('/', ads_controller.getAdsList);
router.get('/:id', ads_controller.getAds)

router.put('/:id/image', ads_controller.upload_ads_image, ads_controller.updateAdsImage);
router.put('/:id', ads_validation.ads_info_input, ads_controller.updateAds);

router.delete('/:id', ads_controller.deleteAds)

module.exports = router;