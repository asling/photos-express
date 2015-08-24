var express = require('express');

var router = express.Router();

var Photo = require('../models/Photo');
var os = require('os');
var path = require('path');
var fs = require('fs');
var join = path.join;

var photosPath = join(__dirname,'/public/photos');

router.get('/',function(req,res,next){
	Photo.find({},function(err,photos){
		if(err) return next(err);
		res.render('photos',{
			title:"Photos",
			photos:photos
		});
	});
	//res.render('photos',{title:'Photos',photos:photos});
	//return next();
});

router.get('/upload',function(req,res,next){
	res.render('photos/upload',{title:"photo upload"});
});
router.post('/upload',function(req,res,next){
	console.log(req.busboy);
	req.busboy.on('file',function(fieldname,file,filename,encoding,mimetype){
		console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
		file.on('data', function(data) {
	        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
	      });
	    file.on('end', function() {
	        console.log('File [' + fieldname + '] Finished');
	    });
	});
	req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    });
	req.busboy.on("finish",function(err){
		res.redirect('/');
	});
	req.pipe(req.busboy);
	/*
	 var saveTo = path.join(os.tmpDir(),path.join(photosPath,path.basename(filename)));
		file.pipe(fs.createWriteStream(saveTo));
	 * */
});

module.exports = router;
