const express = require('express');
const client_controller = require('../../controller/admin/client');
const client_validation = require('../../middleware/admin/client_validation');

router = express.Router();
router.use(express.static('./public/'));

router.post('/', client_validation.client_info_input, client_controller.addNewClient);

router.get('/new', client_controller.client_new);
router.get('/', client_controller.getClientList);
router.get('/:id', client_controller.getClient);

router.put('/:id', client_validation.client_info_input_edit, client_controller.updateClient);

router.delete('/:id', client_controller.deleteClient);

module.exports = router;