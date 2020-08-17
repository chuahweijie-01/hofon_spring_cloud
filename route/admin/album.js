const express = require('express');
const album_controller = require('../../controller/admin/album')

router = express.Router();
router.use(express.static('./public/'));

router.get('/', album_controller.album_display_list);

module.exports = router;