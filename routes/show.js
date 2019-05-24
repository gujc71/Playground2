var express = require('express');
var router = express.Router();
var pool = require('./mysqlConn');

const uploadPath = require('./util').uploadPath;
const APPKEY = require('./util').APPKEY;

router.get('/', function(req, res, next) {
    res.redirect('/show/myTown');
});

router.get('/myTown', function(req,res,next){
    res.render('show/myTown', {appkey: APPKEY});
});

router.get('/myTownMap', function(req,res,next){
    let param = {ib: req.query.ib, jb: req.query.jb}

    pool.getConnection(function (err, connection) {
        var sql = "SELECT PGNO, PGNAME, PGADDR, PGLAT, PGURL, PGLON, PGTYPE1, PGTYPE2, " +
                  "       (6371*ACOS(COS(RADIANS("+param.jb+"))*COS(RADIANS(PGLON))*COS(RADIANS(PGLAT)-RADIANS("+param.ib+"))+SIN(RADIANS("+param.jb+"))*SIN(RADIANS(PGLON))))	AS DISTANCE" + 
                  "  FROM TBL_PLAYGROUND" + 
                  " WHERE DELETEFLAG='N' " + 
                  "HAVING DISTANCE <= 2" + 
                  " ORDER BY PGNAME";
        
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);
            res.render('show/myTownMap', {mapInfo: param, placelist:rows, appkey: APPKEY});
        });
    }); 
});
// /////////////////////////////////////////////////////////////
router.get('/courseList', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "SELECT CMNO, CMTITLE, CMIMAGE, DATE_FORMAT(UPDATEDATE,'%Y-%m-%d') UPDATEDATE" +
                  "  FROM TBL_COURSEMST TCM " +
                  " WHERE DELETEFLAG='N' AND CMSHOW='Y' " +
                   "ORDER BY TCM.CMNO DESC";
        
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.render('show/courseList', {rows: rows});
        });
    }); 
});

router.get('/courseDetail', function(req,res,next){
    if (!req.query.cmno) {
        res.render('admin/course/form', {mstInfo: "", dtlList:[]});
        return;
    }
    pool.getConnection(function (err, connection) {
        let sql = "SELECT CMNO, CMTITLE, CMDESC, DATE_FORMAT(UPDATEDATE,'%Y-%m-%d') UPDATEDATE" + 
                  "  FROM TBL_COURSEMST TCM " +
                  " WHERE DELETEFLAG='N' AND CMSHOW='Y' AND CMNO=" + req.query.cmno;
        connection.query(sql, function (err, mstInfo) {
            if (err) console.error("err : " + err);
            if (mstInfo.length===0) {
                connection.release();
                res.render('error');                
                return;
            }

            sql = "SELECT TCD.CMNO, TPG.PGNO, TPG.PGNAME, TPG.PGADDR, PGTYPE1, CC.CODENM, PGLAT, PGLON, PGURL" + 
                  "  FROM TBL_COURSEDTL TCD" + 
                  " INNER JOIN TBL_PLAYGROUND TPG ON TPG.PGNO=TCD.PGNO" + 
                  " INNER JOIN COM_CODE CC ON TPG.PGTYPE1=CC.CODECD " +
                  " WHERE CLASSNO='e' AND TCD.CMNO="+req.query.cmno +
                  " ORDER BY CDORDER";
                  console.log(sql);
            connection.query(sql, function (err, rows) {
                connection.release();
                if (err) console.error("err : " + err);
    
                res.render('show/courseDetail', {mstInfo: mstInfo[0], dtlList:rows, mapInfo: {ib: rows[0].PGLAT, jb: rows[0].PGLON}, appkey: APPKEY });
            });

        });
    }); 
});

module.exports = router;
