var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.cookie('session', 'hi');
  res.render('index', { title: 'Express', bingo: 'roger', test: 'test.ejs' });
});

module.exports = router;
