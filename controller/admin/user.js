exports.user_create = (req, res) => {

}

exports.user_create_address = (req, res) => {

}

exports.user_display = (req, res) => {

}

exports.user_display_list = (req, res) => {
    res.render('user',{
        title: "消費者",
        icon: '<span class="glyphicon glyphicon-user" aria-hidden="true"></span>',
        navigation: '<li><a href="/api/dashboard">儀表版面</a></li><li class="active">消費者</li>'
    });
}

exports.user_display_address = (req, res) => {

}

exports.user_update = (req, res) => {

}

exports.user_delete = (req, res) => {

}

exports.user_delete_address = (req, res) => {

}

