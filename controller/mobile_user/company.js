exports.selected_company = (req, res) => {
    req.session.company = req.params.id;
    res.redirect('/mobile/api/product');
}