const express = require('express');
const world_controller = require('../../controller/admin/world')

router = express.Router();
router.use(express.static('./public/'));

router.post('/', world_controller.world_create);

router.get('/', world_controller.world_display_list);
router.get('/new', world_controller.world_new);
router.get('/:id', world_controller.world_display);

router.delete('/:id', world_controller.world_delete);

module.exports = router;