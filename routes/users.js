var express = require('express');
var router = express.Router();

var users = require('../models/users');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/newuser', (req, res, next) => {
  
});

module.exports = router;
