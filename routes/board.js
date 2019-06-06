var express = require('express');
var router = express.Router();
var pool = require('./mysqlConn');

router.get('/', function(req, res, next) {
    res.redirect('/board/list');
});

function getListSQL(page) {
    if (!page) page=1;

    let sql = "SELECT BRDNO, BRDTITLE, USERNM BRDWRITER, DATE_FORMAT(BRDDATE,'%Y-%m-%d') BRDDATE" +
              "  FROM TBL_BOARD TB " +
              " INNER JOIN COM_USER CU ON CU.USERNO=TB.USERNO " + 
              " ORDER BY TB.BRDNO DESC" +
              " LIMIT " + ((page-1)*20) + ", 20";    

    return sql;
}

router.get('/list', function(req,res,next){
    pool.getConnection(function (err, connection) {
        connection.query(getListSQL(req.query.page), function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.render('board/list', {rows: rows});
        });
    }); 
});

router.get('/getPageList', function(req,res,next){  // paging
    let page = req.query.page;    

    pool.getConnection(function (err, connection) {
        connection.query(getListSQL(page), function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.send({rows: rows});
        });
    }); 
});

router.get('/read', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "SELECT BRDNO, BRDTITLE, BRDMEMO, TB.USERNO, USERNM BRDWRITER, DATE_FORMAT(BRDDATE,'%Y-%m-%d') BRDDATE"+
                  "  FROM TBL_BOARD TB " +
                  " INNER JOIN COM_USER CU ON CU.USERNO=TB.USERNO" +
                  " WHERE BRDNO=" + req.query.brdno;
            
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.render('board/read', {row: rows[0]});
        });
    }); 
});

router.get('/form', function(req,res,next){
    if (!req.query.brdno) {
        res.render('board/form', {row: ""});
        return;
    }
    pool.getConnection(function (err, connection) {
        var sql = "SELECT BRDNO, BRDTITLE, BRDMEMO, USERNM BRDWRITER, DATE_FORMAT(BRDDATE,'%Y-%m-%d') BRDDATE" + 
                  "  FROM TBL_BOARD TB " +
                  " INNER JOIN COM_USER CU ON CU.USERNO=TB.USERNO" +
                  " WHERE BRDNO=" + req.query.brdno;
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.render('board/form', {row: rows[0]});
        });
    }); 
});

router.post('/save', function(req,res,next){
    var data = [req.body.brdtitle, req.body.brdmemo, req.session.userno, req.body.brdno];

    pool.getConnection(function (err, connection) {
        var sql = "";
        if (req.body.brdno) {
            sql = "UPDATE TBL_BOARD" +
                    " SET BRDTITLE=?, BRDMEMO=?, USERNO=?" +
                  " WHERE BRDNO=?";
        } else {
            sql = "INSERT INTO TBL_BOARD(BRDTITLE, BRDMEMO, USERNO, BRDDATE) VALUES(?,?,?, NOW())";
        }
        connection.query(sql, data, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.redirect('/board/list');
        }); 
    }); 
});

router.get('/delete', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "DELETE FROM TBL_BOARD" +
                  " WHERE BRDNO=" + req.query.brdno;
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.redirect('/board/list');
        });
    }); 
});

module.exports = router;
