function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')
}

function checkNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next()
    }
    res.redirect('/api/dashboard')
}

module.exports = {
    checkAuthenticated    : checkAuthenticated,
    checkNotAuthenticated : checkNotAuthenticated
}