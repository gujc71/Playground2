var express = require('express');
var router = express.Router();
var pool = require('./mysqlConn');

const uploadPath = require('./util').uploadPath;

var multer = require('multer');
var upload = multer({ dest: uploadPath})

router.get('/', function(req, res, next) {
  res.redirect('users/loginForm');
});

router.get('/loginForm', function(req, res, next) {
  res.render('loginForm');
});

router.post('/loginChk', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    var sql = "SELECT USERNO, USERNM, USERROLE"+
               " FROM COM_USER" +
              " WHERE USERID='" + req.body.userid + "' AND USERPW=SHA2('" + req.body.userpw + "', 256)";

    connection.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        connection.release();

        if (rows.length!==1) {
          res.redirect('loginForm');	
          return;
        }
        req.session.userno = rows[0].USERNO;
        req.session.userid = req.body.userid;
        req.session.usernm = rows[0].USERNM;
        req.session.userrole = rows[0].USERROLE;
        req.session.save(function(){
          if (req.session.userrole==="A") {
            res.redirect('/adplace/list');		
          } else{
            res.redirect('/index');		
          }
        });  
    });
  });   
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
      res.redirect('loginForm');
  });
});

// -------------------------------------------------------------
router.get('/profile', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    var sql = "SELECT USERNM, PHOTO"+
               " FROM COM_USER" +
              " WHERE USERNO=" + req.session.userno;

    connection.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        connection.release();

        if (rows.length!==1) {
          res.redirect('loginForm');	
          return;
        }
        res.render('users/profile', {row: rows[0]});
      });
  });   
});

router.post('/profileSave', function(req,res,next){
  var data = [req.body.usernm, req.session.userno];

  pool.getConnection(function (err, connection) {
      var sql = "UPDATE COM_USER" +
                  " SET USERNM=?" +
                " WHERE USERNO=?";
      connection.query(sql, data, function (err, rows) {
          if (err) console.error("err : " + err);
          connection.release();
          res.send("OK"); 
//          res.redirect('/users/profile');
      }); 
  }); 
});

router.post('/changePW', function(req,res,next){
  var data = [req.body.userpw, req.session.userno];

  pool.getConnection(function (err, connection) {
      var sql = "UPDATE COM_USER" +
                  " SET USERPW=SHA2(?, 256)";
                " WHERE USERNO=?";
      connection.query(sql, data, function (err, rows) {
          if (err) console.error("err : " + err);
          connection.release();
          res.send("OK"); 
      }); 
  }); 
});

router.post('/userPhoto', upload.single('userfile'), function(req, res){
  var data = [req.file.filename, req.session.userno];

  pool.getConnection(function (err, connection) {
    var sql = "UPDATE COM_USER" +
                " SET PHOTO=?" +
              " WHERE USERNO=?";
    connection.query(sql, data, function (err, rows) {
        if (err) console.error("err : " + err);
        connection.release();

        res.send(req.file.filename); 
    }); 
  }); 
});

router.get('/getPhoto', function(req,res,next){
  res.download(uploadPath+req.query.filename);
});


module.exports = router;
