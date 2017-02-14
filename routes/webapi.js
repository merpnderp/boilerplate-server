const router = require('express').Router();
const getUserFromSession = require('../authentication').getUserFromSession;

router.use(getUserFromSession);

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