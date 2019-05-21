var express = require('express');
var router = express.Router();

const uploadPath = require('./util').uploadPath;
var multer = require('multer');
var upload = multer({ dest: uploadPath})

// ckeditor
router.post('/uploadFile4Editor', upload.single('upload'), function(req,res,next){
    ret = {uploaded: 1, url: "/common/getimage/" + req.file.filename};
    res.send(JSON.stringify(ret));
});

router.get('/getimage/:filename', function(req,res,next){
    res.download(uploadPath+req.params.filename);
});


module.exports = router;
