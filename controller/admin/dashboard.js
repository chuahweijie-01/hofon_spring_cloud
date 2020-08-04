exports.dashboard = function(req, res){
    //Check for user role
    //Administrator and client should have different data retrieved from database
    
    res.render('index',{
        user: req.session.username,
        title: "儀表版面"
    });
}