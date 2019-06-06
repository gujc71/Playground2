var express = require('express');
var router = express.Router();
var pool = require('./mysqlConn');

const APPKEY = require('./util').APPKEY;

router.get('/', function(req, res, next) {
    res.redirect('/adplace/list');
});

function getListSQL(page, pgtype1, keyword) {
    if (!page) page=1;
    if (!pgtype1) pgtype1="";

    let sql = "SELECT PGNO, PGNAME, PGADDR" + 
              "  FROM TBL_PLAYGROUND TPG " +
              " WHERE DELETEFLAG='N' ";
    if (pgtype1)  sql += " AND PGTYPE1='" + pgtype1 + "'";
    if (keyword)  sql += " AND PGNAME LIKE '%" + keyword + "%'";

    sql += " ORDER BY PGNAME" +
           " LIMIT " + ((page-1)*20) + ", 20";

    return sql;
}

router.get('/list', function(req,res,next){
    let pgtype1 = req.query.pgtype1;
    let keyword = req.query.keyword;
    let page = req.query.page;

    pool.getConnection(function (err, connection) {
        
        connection.query(getListSQL(page, pgtype1, keyword), function (err, rows) {
            if (err) console.error("err : " + err);
            connection.release();

            res.render('admin/place/list', {rows: rows, pgtype1:pgtype1, keyword:keyword});
        });
    }); 
});

router.get('/getPageList', function(req,res,next){  // paging
    pool.getConnection(function (err, connection) {
        connection.query(getListSQL(req.query.page, req.query.pgtype1, req.query.keyword) , function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);

            res.send({rows: rows});
        });
    }); 
});

router.get('/listMap', function(req,res,next){
    let pgtype1 = req.query.pgtype1;
    if (!pgtype1) pgtype1='A';

    pool.getConnection(function (err, connection) {
        let sql = "SELECT PGNO, PGNAME, PGADDR, PGLAT, PGLON, PGTYPE1, PGTYPE2, PGURL, PGTYPE2, CC.CODENM PLACEICON" + 
                  " 	, (SELECT CODENM FROM COM_CODE CCT WHERE  CCT.CLASSNO='t' AND CCT.CODECD = TPG.PGTYPE2) PGTYPE2NM " +
                  "  FROM TBL_PLAYGROUND TPG " +
                  " INNER JOIN COM_CODE CC ON TPG.PGTYPE1=CC.CODECD " +
                  " WHERE CLASSNO='e' AND DELETEFLAG='N' AND PGTYPE1='" + pgtype1 + "' "+
                  " ORDER BY PGNAME" ;
        console.log(sql)
        connection.query(sql, function (err, rows) {
            connection.release(); 
            if (err) console.error("err : " + err);

            res.render('admin/place/listMap', {placelist: rows, pgtype1:pgtype1, appkey: APPKEY});
        });
    }); 
});

router.get('/form', function(req,res,next){
    if (!req.query.pgno) {
        res.render('admin/place/form', {row: "", appkey: APPKEY});
        return;
    }
    pool.getConnection(function (err, connection) {
        var sql = "SELECT PGNO, PGNAME, PGLAT, PGLON, PGURL, PGTEL, PGADDR, PGTYPE1, PGTYPE2, PGSIZE, PGPRICE, PGDESC, PGEXTRA1, PGEXTRA2, PGEXTRA3" + 
                  "  FROM TBL_PLAYGROUND TPG " +
                  " WHERE DELETEFLAG='N' AND PGNO='" + req.query.pgno + "'";
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);

            res.render('admin/place/form', {row: rows[0], appkey: APPKEY});
            connection.release();
        });
    }); 
});

router.get('/formMap', function(req,res,next){
    res.render('admin/place/formMap', {appkey: APPKEY});
});


router.post('/save', function(req,res,next){
    var data = [req.body.pgname, req.body.pglat, req.body.pglon, req.body.pgurl, req.body.pgtel, req.body.pgaddr, req.body.pgtype1, req.body.pgtype2
              , req.body.pgsize, req.body.pgprice, req.body.pgdesc, req.body.pgextra1, req.body.pgextra2, req.body.pgextra3];

    pool.getConnection(function (err, connection) {
        var sql = "";
        if (req.body.pgno) {
            data.push(req.body.pgno);
            sql = "UPDATE TBL_PLAYGROUND" +
                    " SET PGNAME=?, PGLAT=?, PGLON=?, PGURL=?, PGTEL=?, PGADDR=?, PGTYPE1=?, PGTYPE2=?, PGSIZE=?, PGPRICE=?, PGDESC=?, PGEXTRA1=?, PGEXTRA2=?, PGEXTRA3=?, UPDATEDATE=now()" +
                  " WHERE DELETEFLAG='N' AND PGNO=?";
            connection.query(sql, data, function (err, rows) {
                connection.release();
                if (err) console.error("err : " + err);
                res.redirect('/adplace/list?pgtype1='+req.body.pgtype1);
            }); 
        } else {
            let pgtype1 = req.body.pgtype1;
            sql = `SELECT CONCAT('${pgtype1}', RIGHT(CONCAT('00000000', REPLACE(MAX(PGNO), '${pgtype1}', '')+1),9)) AS PGNO FROM TBL_PLAYGROUND WHERE PGTYPE1='${pgtype1}'`;
            
            connection.query(sql, data, function (err, rows) {
                if (err) console.error("err : " + err);

                data.push(rows[0].PGNO);
                sql = "INSERT INTO TBL_PLAYGROUND(PGNAME, PGLAT, PGLON, PGURL, PGTEL, PGADDR, PGTYPE1, PGTYPE2, PGSIZE, PGPRICE, PGDESC, PGEXTRA1, PGEXTRA2, PGEXTRA3, PGNO, UPDATEDATE, DELETEFLAG) " +
                      " VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, now(), 'N')";
                      
                connection.query(sql, data, function (err, rows) {
                    connection.release();
                    if (err) console.error("err : " + err);
                    res.redirect('/adplace/list?pgtype1='+req.body.pgtype1);
                }); 
            }); 
        }
    }); 
});

router.post('/delete', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "UPDATE TBL_PLAYGROUND SET DELETEFLAG='Y'" +
                  " WHERE PGNO='" + req.body.pgno + "'";
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);
            res.redirect('/adplace/list?pgtype1='+req.body.pgtype1);
        });
    }); 
});

module.exports = router;
