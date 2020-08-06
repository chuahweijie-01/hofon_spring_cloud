exports.dashboard = (req, res) => {
    res.render('dashboard',{
        user: req.session.username,
        title: '儀表版面',
        icon: '<span class="glyphicon glyphicon-cog" aria-hidden="true"></span>',
        navigation: '<li class="active">儀表版面</li>'
    });
}