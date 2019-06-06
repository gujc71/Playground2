var express = require('express');
var router = express.Router();
var pool = require('./mysqlConn');

router.get('/', function(req, res, next) {
    res.redirect('/adcourse/list');
});

router.get('/list', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "SELECT CMNO, CMTITLE, CMSTATUS, CODENM CMSTATUSNM, CU.USERNM, DATE_FORMAT(UPDATEDATE,'%Y-%m-%d') UPDATEDATE" +
                  "  FROM TBL_COURSEMST TCM "+ 
                  " INNER JOIN COM_CODE CC ON TCM.CMSTATUS=CC.CODECD " + 
                  " INNER JOIN COM_USER CU ON TCM.USERNO=CU.USERNO  " + 
                  " WHERE TCM.DELETEFLAG='N' AND CLASSNO='s' " +
                  " ORDER BY TCM.CMNO DESC";
        
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.render('admin/course/list', {rows: rows});
        });
    }); 
});

router.get('/changeStatus', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "UPDATE TBL_COURSEMST SET CMSTATUS='" + req.query.status + "'" +
                  " WHERE CMNO=" + req.query.cmno;

        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.redirect('/adcourse/list');
        });
    }); 
});

module.exports = router;
