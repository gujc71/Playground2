var express = require('express');
var router = express.Router();
var pool = require('./mysqlConn');

const uploadPath = require('./util').uploadPath;
const APPKEY = require('./util').APPKEY;

var multer = require('multer');
var upload = multer({ dest: uploadPath})
var fs = require('fs');


router.get('/', function(req, res, next) {
    res.redirect('/adcourse/list');
});

router.get('/list', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "SELECT CMNO, CMTITLE, DATE_FORMAT(UPDATEDATE,'%Y-%m-%d') UPDATEDATE" +
                   " FROM TBL_COURSEMST TCM WHERE DELETEFLAG='N'" +
                   "ORDER BY TCM.CMNO DESC";
        
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);

            res.render('admin/course/list', {rows: rows});
            connection.release();
        });
    }); 
});

router.get('/form', function(req,res,next){
    if (!req.query.cmno) {
        res.render('admin/course/form', {mstInfo: "", dtlList:[]});
        return;
    }
    pool.getConnection(function (err, connection) {
        let sql = "SELECT CMNO, CMTITLE, CMDESC, CMSHOW, DATE_FORMAT(UPDATEDATE,'%Y-%m-%d') UPDATEDATE" + 
                  "  FROM TBL_COURSEMST TCM " +
                  " WHERE DELETEFLAG='N' AND CMNO=" + req.query.cmno;
        connection.query(sql, function (err, mstInfo) {
            if (err) console.error("err : " + err);

            sql = "SELECT TCD.CDNO, TCD.CMNO, TPG.PGNO, TPG.PGNAME, TPG.PGADDR, PGTYPE1, PGTYPE2, CDORDER, CC.CODENM PLACEICON" + 
                  "  FROM TBL_COURSEDTL TCD" + 
                  " INNER JOIN TBL_PLAYGROUND TPG ON TPG.PGNO=TCD.PGNO" + 
                  " INNER JOIN COM_CODE CC ON TPG.PGTYPE1=CC.CODECD " +
                  " WHERE CLASSNO='E' AND TCD.CMNO="+req.query.cmno +
                  " ORDER BY CDORDER";
            connection.query(sql, function (err, rows) {
                connection.release();
                if (err) console.error("err : " + err);
    
                res.render('admin/course/form', {mstInfo: mstInfo[0], dtlList:rows});
            });

        });
    }); 
});

router.post('/save', upload.single('cmimage'), function(req,res,next){
    pool.getConnection(function (err, connection) {
        if (req.body.cmno) {
            let data = [req.body.cmtitle, req.body.cmdesc];
            let sql = "UPDATE TBL_COURSEMST" +
                        " SET CMTITLE=?, CMDESC=?";
            if (req.file) {
                sql += " , CMIMAGE=?";
                data.push(req.file.filename);
                let sql1 = "SELECT CMIMAGE FROM TBL_COURSEMST WHERE CMNO="+req.body.cmno;
                connection.query(sql1, function (err, rows) {
                    if (rows[0].CMIMAGE) fs.unlinkSync(uploadPath + rows[0].CMIMAGE);    
                }); 
            }
            sql += " WHERE CMNO=?";
            data.push(req.body.cmno);

            connection.query(sql, data, function (err, rows) {
                connection.release();
                if (err) console.error("err : " + err);

                res.redirect('/adcourse/list');
            }); 
        } else {
            let sql = "SELECT IFNULL(MAX(CMNO),0) + 1 CMNO FROM TBL_COURSEMST";
            connection.query(sql, function (err, rows) {
                let data = [req.body.cmtitle, req.body.cmdesc, rows[0].CMNO, req.file.filename];
                sql = "INSERT INTO TBL_COURSEMST(CMTITLE, CMDESC, CMNO, CMIMAGE, CMSHOW, CMREAD, UPDATEDATE, DELETEFLAG) VALUES(?,?,?,?, 'N', 0, NOW(), 'N')";
                connection.query(sql, data, function (err, rows) {
                    connection.release();
                    if (err) console.error("err : " + err);
        
                    res.redirect('/adcourse/list');
                }); 
            }); 
    
        }
    }); 
});

router.post('/delete', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "UPDATE TBL_COURSEMST SET DELETEFLAG='Y'" +
                  " WHERE CMNO=" + req.body.cmno;
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.redirect('/adcourse/list');
        });
    }); 
});

router.post('/setCourseShow', function(req,res,next){
    pool.getConnection(function (err, connection) {
        let sql = "UPDATE TBL_COURSEMST" +
                    " SET CMSHOW='" + req.body.cmshow + "' " + 
                    " WHERE CMNO="+ req.body.cmno;
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.send('OK');
        }); 
    }); 
});

///////////////////////////////////////////////////////////////////////////////
router.get('/getList', function(req,res,next){ 
    let keyword = req.query.keyword;

    pool.getConnection(function (err, connection) {
        let sql = "SELECT PGNO, PGNAME, PGADDR, PGTYPE1" +
                  "  FROM TBL_PLAYGROUND TPG " +
                  " WHERE DELETEFLAG='N' AND PGNAME LIKE '%" + keyword + "%'" +
                  " ORDER BY PGNAME" +
                  " LIMIT 0, 100";
        
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.send({rows: rows});
        });
    }); 
});

router.post('/courseItemSave', function(req,res,next){
    let data = [req.body.cmno, req.body.pgno, req.body.cmno];

    pool.getConnection(function (err, connection) {
        let sql = "INSERT INTO TBL_COURSEDTL(CMNO, PGNO, CDORDER) SELECT ?, ?, IFNULL(MAX(CDORDER),0)+1 FROM TBL_COURSEDTL WHERE CMNO=?";
        connection.query(sql, data, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.send("OK");
        }); 
    }); 
});

router.post('/courseItemDelete', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "DELETE FROM TBL_COURSEDTL" +
                  " WHERE CMNO=" + req.body.cmno + " AND PGNO='" + req.body.pgno + "'";
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.send("OK");
        });
    }); 
});

router.get('/courseMap', function(req,res,next){ 
    let keyword = req.query.keyword;

    pool.getConnection(function (err, connection) {
        sql = "SELECT TCD.CMNO, TPG.PGNO, TPG.PGNAME, TPG.PGADDR, PGTYPE1, PGLAT, PGLON, PGURL, CC.CODENM PLACEICON " + 
              " 	, (SELECT CODENM FROM COM_CODE CCT WHERE  CCT.CLASSNO='t' AND CCT.CODECD = TPG.PGTYPE2) PGTYPE2NM " +
              "  FROM TBL_COURSEDTL TCD" + 
              " INNER JOIN TBL_PLAYGROUND TPG ON TPG.PGNO=TCD.PGNO" + 
              " INNER JOIN COM_CODE CC ON TPG.PGTYPE1=CC.CODECD " +
              " WHERE CLASSNO='e' AND TPG.DELETEFLAG='N' AND TCD.CMNO="+req.query.cmno;
        
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.render('admin/course/courseMap', {placelist:rows, mapInfo: {ib: rows[0].PGLAT, jb: rows[0].PGLON}, appkey: APPKEY});
        });
    }); 
});

router.post('/courseItemReorder', function(req,res,next){ 
    pool.getConnection(function (err, connection) {
        let cmno = req.body.cmno;
        let neworder = req.body.neworder;
        let oldorder = req.body.oldorder;
        let sql = "";
        if (oldorder > neworder)
             sql = "UPDATE TBL_COURSEDTL SET CDORDER=CDORDER+1 WHERE CMNO=" + cmno + " AND CDORDER>=" + neworder + " AND CDORDER<" + oldorder;
        else sql = "UPDATE TBL_COURSEDTL SET CDORDER=CDORDER-1 WHERE CMNO=" + cmno + " AND CDORDER>=" + oldorder + " AND CDORDER<=" + neworder;

        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);

            sql = "UPDATE TBL_COURSEDTL SET CDORDER=" + neworder + " WHERE CDNO=" + req.body.cdno;
            connection.query(sql, function (err, rows) {
                connection.release();
                if (err) console.error("err : " + err);
    
                res.send('OK');
            });
        });
    }); 
});

/*
myTownMap
*/
router.get('/getTownMap', function(req,res,next){
    let param = {ib: req.query.ib, jb: req.query.jb}

    pool.getConnection(function (err, connection) {
        var sql = "SELECT PGNO, PGNAME, PGADDR, PGLAT, PGLON, PGTYPE1, PGTYPE2, PGURL, " +
                  "       (6371*ACOS(COS(RADIANS("+param.jb+"))*COS(RADIANS(PGLON))*COS(RADIANS(PGLAT)-RADIANS("+param.ib+"))+SIN(RADIANS("+param.jb+"))*SIN(RADIANS(PGLON))))	AS DISTANCE" + 
                  "  FROM TBL_PLAYGROUND" + 
                  " WHERE DELETEFLAG='N' " + 
                  "HAVING DISTANCE <= 2" + 
                  " ORDER BY PGNAME";
        
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);
            res.send({placelist:rows});
        });
    }); 
});

module.exports = router;
