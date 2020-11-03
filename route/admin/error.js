const express = require('express');

router = express.Router();
router.use(express.static('./public/'));

router.get('/', (req, res) => {
    res.render('error_page', {
        title: '管理總表',
        icon: '<span class="glyphicon glyphicon-cog" aria-hidden="true"></span>',
        navigation: '<li class="active">管理總表</li>',
        message: req.flash(`flash`)
    });
})

module.exports = router;