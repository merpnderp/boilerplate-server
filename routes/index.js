const express = require('express');
const router = express.Router();

//router.disable('x-powered-by');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.cookie('session', 'hi');
  res.render('index', { title: 'Express', bingo: 'roger', test: 'test.ejs' });
});

module.exports = router;
