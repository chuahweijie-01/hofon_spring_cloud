const express = require('express');
const award_controller = require('../../controller/admin/award');
const award_validation = require('../../middleware/admin/award_validation');


router = express.Router();
router.use(express.static('./public/'));

router.post('/', award_validation.award_info_input, award_controller.award_create)

router.get('/new', award_controller.award_new);
router.get('/', award_controller.award_display_list);
router.get('/:id', award_controller.award_display)

router.put('/:id', award_validation.award_info_input, award_controller.award_update)

router.delete('/:id', award_controller.award_delete)

module.exports = router;