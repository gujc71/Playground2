var express = require('express');
var router = express.Router();
var pool = require('./mysqlConn');

router.get('/', function(req, res, next) {
    res.redirect('/adusers/list');
});

function getListSQL(page) {
    if (!page) page=1;

    let sql = "SELECT USERNO, USERID, USERNM, USERMAIL, DATE_FORMAT(ENTRYDATE,'%Y-%m-%d') ENTRYDATE" +
              " FROM COM_USER CU " +
              " WHERE DELETEFLAG='N' AND USERROLE!='A'" +
              " ORDER BY CU.USERNO DESC" +
              " LIMIT " + ((page-1)*20) + ", 20";    

    return sql;
}

router.get('/list', function(req,res,next){
    pool.getConnection(function (err, connection) {
        connection.query(getListSQL(req.query.page), function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.render('admin/userlist', {rows: rows});
        });
    }); 
});

router.get('/getPageList', function(req,res,next){
    pool.getConnection(function (err, connection) {
        connection.query(getListSQL(req.query.page), function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.send({rows: rows});
        });
    }); 
});

router.get('/read', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "SELECT USERID, CU.USERNO, USERNM, USERMAIL"+
                  "  FROM COM_USER CU " +
                  " WHERE DELETEFLAG='N' AND USERNO=" + req.query.userno;
            
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

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
        var sql = "SELECT USERNO, USERID, USERNM, USERMAIL, DATE_FORMAT(ENTRYDATE,'%Y-%m-%d') ENTRYDATE" + 
                  "  FROM COM_USER CU " +
                  " WHERE DELETEFLAG='N' AND USERNO=" + req.query.userno;
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.render('adusers/form', {row: rows[0]});
        });
    }); 
});

router.post('/save', function(req,res,next){
    var data = [];

    pool.getConnection(function (err, connection) {
        var sql = "";
        if (req.body.userno) {
            data = [req.body.usernm, req.body.usermail, req.body.userno];
            sql = "UPDATE COM_USER" +
                    " SET USERNM=?, USERMAIL=?" +
                  " WHERE USERNO=?";
            connection.query(sql, data, function (err, rows) {
                connection.release();
                if (err) console.error("err : " + err);
                res.send("OK");
                //res.redirect('/adusers/list'); 
            });                   
        } else {
            data = [req.body.userid, req.body.usernm, req.body.userpw, req.body.usermail];
            sql = "SELECT USERNO FROM COM_USER WHERE USERID=?";
            connection.query(sql, data, function (err, rows) {
                if (err) console.error("err : " + err);
                if (rows.length>0) {
                    connection.release(); 
                    res.send("duplicate");
                    return;
                }
                sql = "INSERT INTO COM_USER(USERID, USERNM, USERPW, USERMAIL, USERROLE, ENTRYDATE, DELETEFLAG) VALUES(?,?, SHA2(?, 256), ?, 'U', NOW(), 'N')";
                connection.query(sql, data, function (err, rows) {
                    connection.release();
                    if (err) console.error("err : " + err);
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
            connection.release();
            if (err) console.error("err : " + err);

            connection.release();
        });
    }); 
});

module.exports = router;
