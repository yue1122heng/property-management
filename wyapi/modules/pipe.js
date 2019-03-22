function checkLogin(req, res, next) {
    if (!req.session.loginInfo) {
        res.send({code: 401, message: '未登录'});
        return;
    }
    next();
}

module.exports = {
    checkLogin
}