var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET hello world page */
router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'Hello, World!' }); 
}); 

// GET user list page 
router.get('/userlist', function(req, res){
  var db = req.db; 
  var collection = db.get('usercollection'); 
  collection.find({}, {}, function(e, docs) {
    res.render('userlist', {
      "userlist" : docs
    });
  });
}); 

/* GET new user page */
router.get('/newuser', function(req, res) {
  res.render('newuser', { title: 'Add New User'}); 
}); 

/* POST to add user service */ 
router.post('/adduser', function(req, res) {

  // set internal db variable
  var db = req.db; 

  // get form values. These rely on the "name" attribute
  var userName = req.body.username; 
  var userEmail = req.body.useremail; 

  // set our collection
  var collection = db.get('usercollection'); 

  // submit to the db 
  collection.insert({
    "username" : userName, 
    "email" : userEmail
  }, function(err, doc) {
    if (err) {
      // if it failed, return error
      res.send("there was a prob adding the info"); 
    } else {
      // forward to success page 
      res.redirect("userlist"); 
    }
  }); 
}); 

module.exports = router;
