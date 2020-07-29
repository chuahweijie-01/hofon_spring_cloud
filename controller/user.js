exports.user_create = function(req, res){

}

exports.user_create_address = function(req, res){

}

exports.user_display = function(req, res){

}

exports.user_display_list = function(req, res){
    res.render('user',{
        user: req.session.email,
        title: "消費者"
    });
}

exports.user_display_address = function(req, res){

}

exports.user_update = function(req, res){

}

exports.user_delete = function(req, res){

}

exports.user_delete_address = function(req, res){

}

