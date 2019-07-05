var express = require('express');
var router = express.Router();
var pool = require('./mysqlConn');
var dateFormat = require('dateformat');

const APPKEY = require('./util').APPKEY;

router.get('/', function(req, res, next) {
    res.redirect('/show/myTown');
});

router.get('/myTown', function(req,res,next){
    res.render('show/myTown', {appkey: APPKEY});
});

router.get('/myTownMap', function(req,res,next){
    let param = {lat: req.query.lat, lng: req.query.lng}

    pool.getConnection(function (err, connection) {
        var sql = "SELECT PGNO, PGNAME, PGADDR, PGURL, PGLAT, PGLON, PGTYPE1, PGTYPE2, CC.CODENM PLACEICON " +
                  " 	, (SELECT CODENM FROM COM_CODE CCT WHERE  CCT.CLASSNO='t' AND CCT.CODECD = TPG.PGTYPE2) PGTYPE2NM " +
                  "     , (6371*ACOS(COS(RADIANS("+param.lng+"))*COS(RADIANS(PGLON))*COS(RADIANS(PGLAT)-RADIANS("+param.lat+"))+SIN(RADIANS("+param.lng+"))*SIN(RADIANS(PGLON))))	AS DISTANCE" + 
                  "  FROM TBL_PLAYGROUND TPG" + 
                  " INNER JOIN COM_CODE CC ON TPG.PGTYPE1=CC.CODECD " +
                  " WHERE CLASSNO='e' AND DELETEFLAG='N' " + 
                  "HAVING DISTANCE <= 2" + 
                  " ORDER BY PGNAME";
console.log(sql);
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);
            res.render('show/myTownMap', {mapInfo: param, placelist:rows, appkey: APPKEY});
        });
    }); 
});

router.get('/myTownMapService', function(req,res,next){
    let param = {lat: req.query.lat, lng: req.query.lng}

    pool.getConnection(function (err, connection) {
        var sql = "SELECT pgno, pgname, pgaddr, pgurl, pglat, pglon, pgtype1, pgtype2, cc.codenm placeicon " +
                  " 	, (SELECT CODENM FROM COM_CODE CCT WHERE  CCT.CLASSNO='t' AND CCT.CODECD = TPG.PGTYPE2) pgtype2nm " +
                  "     , (6371*ACOS(COS(RADIANS("+param.lng+"))*COS(RADIANS(PGLON))*COS(RADIANS(PGLAT)-RADIANS("+param.lat+"))+SIN(RADIANS("+param.lng+"))*SIN(RADIANS(PGLON))))	AS DISTANCE" + 
                  "  FROM TBL_PLAYGROUND TPG" + 
                  " INNER JOIN COM_CODE CC ON TPG.PGTYPE1=CC.CODECD " +
                  " WHERE CLASSNO='e' AND DELETEFLAG='N' " + 
                  "HAVING DISTANCE <= 2" + 
                  " ORDER BY PGNAME";

        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);
            res.json(rows);
            //res.json({placelist:rows});
        });
    }); 
});

// /////////////////////////////////////////////////////////////
function getListSQL(page) {
    if (!page) page=1;

    let sql = "SELECT CMNO, CMTITLE, CMIMAGE, DATE_FORMAT(UPDATEDATE,'%Y-%m-%d') UPDATEDATE" +
              "  FROM TBL_COURSEMST TCM " +
              " WHERE DELETEFLAG='N' AND CMSTATUS='3'" +
              " ORDER BY TCM.CMNO DESC" + 
              " LIMIT " + ((page-1)*20) + ", 20";    
    return sql;
}

router.get('/courseList', function(req,res,next){
    pool.getConnection(function (err, connection) {
        connection.query(getListSQL(req.query.page), function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.render('show/courseList', {rows: rows});
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

router.get('/courseDetail', function(req,res,next){
    if (!req.query.cmno) {
        res.render('common/error');                
        return;
    }
    pool.getConnection(function (err, connection) {
        let sql = "SELECT CMNO, CMTITLE, CMDESC, DATE_FORMAT(UPDATEDATE,'%Y-%m-%d') UPDATEDATE" + 
                  "  FROM TBL_COURSEMST TCM " +
                  " WHERE DELETEFLAG='N' AND CMSTATUS='3' AND CMNO=" + req.query.cmno;
        connection.query(sql, function (err, mstInfo) {
            if (err) console.error("err : " + err);
            if (mstInfo.length===0) {
                connection.release();
                res.render('common/error');                
                return;
            }

            sql = "SELECT TCD.CMNO, TPG.PGNO, TPG.PGNAME, TPG.PGADDR, PGTYPE1, PGTYPE2, CC.CODENM PLACEICON, PGLAT, PGLON, PGURL" + 
                  " 	, (SELECT CODENM FROM COM_CODE CCT WHERE  CCT.CLASSNO='t' AND CCT.CODECD = TPG.PGTYPE2) PGTYPE2NM " +
                  "  FROM TBL_COURSEDTL TCD" + 
                  " INNER JOIN TBL_PLAYGROUND TPG ON TPG.PGNO=TCD.PGNO" + 
                  " INNER JOIN COM_CODE CC ON TPG.PGTYPE1=CC.CODECD " +
                  " WHERE CLASSNO='e' AND TCD.CMNO="+req.query.cmno +
                  " ORDER BY CDORDER";
            connection.query(sql, function (err, dtlList) {
                if (err) console.error("err : " + err);

                sql = "UPDATE TBL_COURSEMST SET CMREAD=CMREAD+1 WHERE CMNO="+req.query.cmno
                connection.query(sql, function (err, rows) {
                    connection.release();
                    if (err) console.error("err : " + err);
        
                    res.render('show/courseDetail', {mstInfo: mstInfo[0], dtlList:dtlList, mapInfo: {lat: dtlList[0].PGLAT, lng: dtlList[0].PGLON}, appkey: APPKEY });
                });            
            });
        });
    }); 
});


router.get('/courseListService', function(req,res,next){
    let sql = "SELECT cmno, cmtitle, cmimage, DATE_FORMAT(UPDATEDATE,'%Y-%m-%d') updatedate" +
              "  FROM TBL_COURSEMST TCM " +
              " WHERE DELETEFLAG='N' AND CMSTATUS='3'" +
              " ORDER BY TCM.CMNO DESC" ;    

    pool.getConnection(function (err, connection) {
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.json(rows);
        });
    }); 
});

router.get('/courseDetailMService', function(req,res,next){
    if (!req.query.cmno) {
        res.render('common/error');                
        return;
    }
    pool.getConnection(function (err, connection) {
        let sql = "SELECT cmno, cmtitle, cmdesc, DATE_FORMAT(UPDATEDATE,'%Y-%m-%d') updatedate" + 
                  "  FROM TBL_COURSEMST TCM " +
                  " WHERE DELETEFLAG='N' AND CMSTATUS='3' AND CMNO=" + req.query.cmno;
        connection.query(sql, function (err, mstInfo) {
            if (err) console.error("err : " + err);
            if (mstInfo.length===0) {
                connection.release();
                res.render('common/error');                
                return;
            }

            res.json( mstInfo[0]);
        });
        sql = "UPDATE TBL_COURSEMST SET CMREAD=CMREAD+1 WHERE CMNO="+req.query.cmno
        connection.query(sql, function (err, rows) {
            connection.release();
        });            
    }); 
});

router.get('/courseDetailDService', function(req,res,next){
    let sql = "";
    pool.getConnection(function (err, connection) {
        sql = "SELECT tcd.cmno, tpg.pgno, tpg.pgname, tpg.pgaddr, pgtype1, pgtype2, cc.codenm placeicon, pglat, pglon, pgurl" + 
                " 	, (SELECT CODENM FROM COM_CODE CCT WHERE  CCT.CLASSNO='t' AND CCT.CODECD = TPG.PGTYPE2) pgtype2nm " +
                "  FROM TBL_COURSEDTL TCD" + 
                " INNER JOIN TBL_PLAYGROUND TPG ON TPG.PGNO=TCD.PGNO" + 
                " INNER JOIN COM_CODE CC ON TPG.PGTYPE1=CC.CODECD " +
                " WHERE CLASSNO='e' AND TCD.CMNO="+req.query.cmno +
                " ORDER BY CDORDER";
        connection.query(sql, function (err, dtlList) {
            if (err) console.error("err : " + err);
    
            res.json( dtlList);
        });
    }); 
});

// ====================================================================

router.get('/getCourseReply', function(req,res,next){
    let sql = "SELECT RENO, REMEMO, REDATE, TCR.USERNO, CU.USERNM, CU.PHOTO, IF (TCR.USERNO='" + req.session.userno + "', 'Y','') ISMINE" +
              "     , DATE_FORMAT(REDATE,'%Y-%m-%d %h:%i') REDATE"+
              "  FROM TBL_COURSEREPLY TCR"+
              " INNER JOIN COM_USER CU ON CU.USERNO=TCR.USERNO"+
              " WHERE REDELETEFLAG='N' AND CMNO=" + req.query.cmno+
              " ORDER BY RENO";
              console.log(sql);              
    pool.getConnection(function (err, connection) {
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.send(rows);
        });
    }); 
});

router.post('/replySave', function(req,res,next){
    let reno = req.body.reno;

    pool.getConnection(function (err, connection) {
        let data = [], sql = "";
        if (reno) {
            data = [req.body.rememo, reno];
            sql = "UPDATE TBL_COURSEREPLY" +
                    " SET REMEMO=?" +
                  " WHERE RENO=?";
        } else {
            data = [req.body.cmno, req.body.rememo, req.session.userno];
            sql = "INSERT INTO TBL_COURSEREPLY(CMNO, REMEMO, USERNO, REDATE, REDELETEFLAG) VALUES(?,?,?, NOW(), 'N')";
        }
        
        connection.query(sql, data, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.redirect('courseDetail?cmno='+req.body.cmno);
        }); 
    }); 
});

router.get('/replyDelete', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "UPDATE TBL_COURSEREPLY" +
                  "   SET REDELETEFLAG='Y'" +
                  " WHERE RENO=" + req.query.reno;
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.redirect('courseDetail?cmno='+req.query.cmno);
        });
    }); 
});

// /////////////////////////////////////////////////////////////

router.get('/streetMap', function(req,res,next){
    let eventDate = req.query.eventDate;
    if (!eventDate) eventDate = dateFormat(new Date(), "yyyy-mm-dd");

    pool.getConnection(function (err, connection) {
        let sql = "SELECT SEPLACE, SEDATE, SELAT, SELON, SEADDR, GROUP_CONCAT(concat(SEPLAYER, '|', SETIME, '|', SETYPE)) PLAY" +
                  "  FROM TBL_STREETEVENT " +
                  " WHERE SEDATE = '" + eventDate + "' " +
                  " GROUP BY  SEPLACE, SEDATE, SELAT, SELON, SEADDR";
//console.log(sql);
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);
            res.render('show/streetMap', {eventDate: eventDate, placelist:rows, appkey: APPKEY});
        });
    }); 
});

module.exports = router;
