var express = require('express');
var router = express.Router();
var pool = require('./mysqlConn');

router.get('/', function(req, res, next) {
    res.redirect('/adusers/list');
});

router.get('/list', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "SELECT USERNO, USERID, USERNM, DATE_FORMAT(ENTRYDATE,'%Y-%m-%d') ENTRYDATE" +
                   " FROM COM_USER CU " +
                   " WHERE DELETEFLAG='N' AND USERROLE!='A'" +
                   "ORDER BY CU.USERNO DESC";
        
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);
            connection.release();

            res.render('admin/userlist', {rows: rows});
        });
    }); 
});

router.get('/read', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "SELECT USERID, CU.USERNO, USERNM"+
                  "  FROM COM_USER CU " +
                  " WHERE DELETEFLAG='N' AND USERNO=" + req.query.userno;
            
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);

            connection.release();
            res.send(rows[0]); 
        });
    }); 
});

router.get('/form', function(req,res,next){
    if (!req.query.userno) {
        res.render('adusers/form', {row: ""});
        return;
    }
    pool.getConnection(function (err, connection) {
        var sql = "SELECT USERNO, USERID, USERNM, DATE_FORMAT(ENTRYDATE,'%Y-%m-%d') ENTRYDATE" + 
                  "  FROM COM_USER CU " +
                  " WHERE DELETEFLAG='N' AND USERNO=" + req.query.userno;
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);
            connection.release();

            res.render('adusers/form', {row: rows[0]});
        });
    }); 
});

router.post('/save', function(req,res,next){
    var data = [];

    pool.getConnection(function (err, connection) {
        var sql = "";
        if (req.body.userno) {
            data = [req.body.usernm, req.body.userno];
            sql = "UPDATE COM_USER" +
                    " SET USERNM=?" +
                  " WHERE USERNO=?";
            connection.query(sql, data, function (err, rows) {
                if (err) console.error("err : " + err);
                connection.release(); 
                res.send("OK");
                //res.redirect('/adusers/list'); 
            });                   
        } else {
            data = [req.body.userid, req.body.usernm, req.body.userpw];
            sql = "SELECT USERNO FROM COM_USER WHERE USERID=?";
            connection.query(sql, data, function (err, rows) {
                if (err) console.error("err : " + err);
                if (rows.length>0) {
                    connection.release(); 
                    res.send("duplicate");
                    return;
                }
                sql = "INSERT INTO COM_USER(USERID, USERNM, USERPW, USERROLE, ENTRYDATE, DELETEFLAG) VALUES(?,?, SHA2(?, 256), 'U', NOW(), 'N')";
                connection.query(sql, data, function (err, rows) {
                    if (err) console.error("err : " + err);
                    connection.release(); 
                    res.send("OK");
                    //res.redirect('/adusers/list'); 
                }); 
            });              
        }
    }); 
});

router.get('/delete', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "UPDATE COM_USER SET DELETEFLAG='Y'" +
                  " WHERE USERNO=" + req.query.userno;
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);

            res.redirect('/adusers/list');
            connection.release();
        });
    }); 
});

module.exports = router;
