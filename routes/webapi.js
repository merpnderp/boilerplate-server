const router = require('express').Router();
const getUserBySessionToken = require('../authentication').getUserBySessionToken;

router.use(getUserBySessionToken);

router.get('/', (req, res) => {
	res.send('hi');
})

router.post('/login', (req, res) => {

});

router.get('/logout', (req, res) => {

})

router.post('/createUser', (req, res) => {

});



module.exports = router;
