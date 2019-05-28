var express = require('express');
var router = express.Router();
var pool = require('./mysqlConn');

const uploadPath = require('./util').uploadPath;

var multer = require('multer');
var upload = multer({ dest: uploadPath})

router.get('/', function(req, res, next) {
  res.redirect('/users/loginForm');
});

router.get('/loginForm', function(req, res, next) {
  res.render('users/loginForm');
});

router.post('/loginChk', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    let sql = "SELECT USERNO, USERNM, USERROLE"+
               " FROM COM_USER" +
              " WHERE USERID='" + req.body.userid + "' AND USERPW=SHA2('" + req.body.userpw + "', 256)";

    connection.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        connection.release();

        if (rows.length!==1) {
          res.redirect('loginForm');	
          return;
        }
        setSession (req, res, rows[0]);
    });
  });   
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
      res.redirect('loginForm');
  });
});
// -------------------------------------------------------------

router.get('/joinForm', function(req, res, next) {
  res.render('users/joinForm');
});

router.post('/joinFormSave', function(req, res, next) {
  pool.getConnection(function (err, connection) {
      let sql = "SELECT USERNO, USERNM, USERROLE"+
                " FROM COM_USER" +
                " WHERE USERID='" + req.body.userid+"'";
      connection.query(sql, function (err, rows) {
        if (err) console.error("err : " + err);
        if (rows.length>0) {
          connection.release();
          res.render('users/joinFormError');
          return;
        }
        let data = [req.body.userid, req.body.usernm, req.body.userpw, req.body.usermail, req.body.usersns];
        let sql = "INSERT INTO COM_USER (USERID, USERNM, USERPW, USERMAIL, USERSNS, USERROLE, ENTRYDATE, DELETEFLAG) VALUES(?, ?, SHA2(?, 256), ?, ?, 'U', NOW(), 'N')";
        connection.query(sql, data, function (err, rows) {
          if (err) console.error("err : " + err);
    
          let sql = "SELECT USERNO, USERNM, USERROLE"+
                    " FROM COM_USER" +
                    " WHERE USERID='" + req.body.userid+"'";
          connection.query(sql, function (err, rows) {
            connection.release();
            if (err) console.error("err : " + err);
      
            setSession (req, res, rows[0]);
          });   
        });   
      });   
  });   
});

function setSession (req, res, user) {
  req.session.userno = user.USERNO;
  req.session.userid = user.USERID;
  req.session.usernm = user.USERNM;
  req.session.userrole = user.USERROLE;
  if (req.session.userrole==="A") {
    res.redirect('/adplace/list');		
  } else{
    res.redirect('/index');		
  }
}
// -------------------------------------------------------------
router.get('/profile', function(req, res, next) {
  pool.getConnection(function (err, connection) {
    let sql = "SELECT USERNM, USERMAIL, PHOTO"+
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
  let data = [req.body.usernm, req.session.userno];

  pool.getConnection(function (err, connection) {
      let sql = "UPDATE COM_USER" +
                  " SET USERNM=?" +
                " WHERE USERNO=?";
      connection.query(sql, data, function (err, rows) {
          if (err) console.error("err : " + err);
          connection.release();
          res.send("OK"); 
      }); 
  }); 
});

router.post('/changePW', function(req,res,next){
  let data = [req.body.userpw, req.session.userno];

  pool.getConnection(function (err, connection) {
      let sql = "UPDATE COM_USER" +
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
  let data = [req.file.filename, req.session.userno];

  pool.getConnection(function (err, connection) {
    let sql = "UPDATE COM_USER" +
                " SET PHOTO=?" +
              " WHERE USERNO=?";
    connection.query(sql, data, function (err, rows) {
        if (err) console.error("err : " + err);
        connection.release();

        res.send(req.file.filename); 
    }); 
  }); 
});

module.exports = router;
