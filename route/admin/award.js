const express = require('express');
const awardController = require('../../controller/admin/award');
const awardValidation = require('../../middleware/admin/award_validation');
const privilegesValidation = require('../../middleware/admin/privilegesValidation');

router = express.Router();
router.use(express.static('./public/'));

router.use(privilegesValidation.privilegesCheck('7'));

router.post('/', awardValidation.awardInputValidation, awardController.addNewAward)

router.get('/new', awardController.award_new);
router.get('/', awardController.getAwardList);
router.get('/:id', awardController.getAward)

router.put('/:id', awardValidation.awardInputValidation, awardController.updateAward)

router.delete('/:id', awardController.deleteAward)

module.exports = router;