const company_model = require('../model/company')

exports.company_create = (req, res) => {
    var insertValues = 'Entering';
    company_model.addCompany(insertValues).then((result) => {
        req.flash('success', "資料更新成功");
        res.redirect('/api/company/new');
    }).catch((err) => {
        req.flash('error', "數據庫並未連接");
        res.redirect('/api/company/new');
    })
}

exports.company_display = function(req, res){

}

exports.company_display_list = function(req, res){
    res.render('company',{
        user: req.session.email,
        title: "公司"
    });
}

exports.company_new = function(req, res){
    res.render('company_modify',{
        user: req.session.email,
        title: "公司"
    });
}

exports.company_update = function(req, res){
    
}

exports.company_delete = function(req, res){
    title = JSON.stringify(req.body.title);
    console.log(title);
    res.send("This if far away from Express : " + title);
}