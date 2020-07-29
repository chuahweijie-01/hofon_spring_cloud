const award_model = require('../model/award')

exports.award_create = function(req, res){
    var insertValues = 'Entering';
    award_model.addAward(insertValues).then((result) => {
        req.flash('success', "資料更新成功");
        res.redirect('/api/award/new');
    }).catch((err) => {
        req.flash('error', "數據庫並未連接");
        res.redirect('/api/award/new');
    })
}

exports.award_display = function(req, res){
    
}

exports.award_display_list = function(req, res){
    res.render('award',{
        user: req.session.email,
        title: "榮譽"
    });
}

exports.award_new = function(req, res){
    res.render('award_modify',{
        user: req.session.email,
        title: "榮譽"
    });
}


exports.award_update = function(req, res){
    
}

exports.award_delete = function(req, res){
    
}


