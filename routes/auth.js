const express = require('express');
const router = express.Router();
const passport = require('passport');
var pool = require('./mysqlConn');

router.get('/facebook', passport.authenticate('facebook',{scope:'email'}));
router.get('/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/users/loginForm'
}), (req, res) => {
    loginSuccessHandler(req, res);
});

router.get('/google', passport.authenticate('google'));
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/users/loginForm'
}), (req, res) => {
    loginSuccessHandler(req, res);
});

function loginSuccessHandler(req, res) {

    let user = req.user;
    pool.getConnection(function (err, connection) {
        var sql = "SELECT USERNO, USERID, USERNM, USERROLE FROM COM_USER WHERE USERID='" + user.id + "'";
        
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            if (rows.length===0) {
                res.locals.userrole = null;
                res.locals.userno = null;
                res.locals.usernm = null;
                res.render('users/joinForm4sns', {user: user})
            } else {
                req.session.userno = rows[0].USERNO;
                req.session.userid = rows[0].USERID;
                req.session.usernm = rows[0].USERNM;
                req.session.userrole = rows[0].USERROLE;
                req.session.save(function(){
                    res.redirect('/index');		
                });                  
            }
        });
    }); 
}

module.exports = router;
