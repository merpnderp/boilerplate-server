const router = require('express').Router();

//router.disable('x-powered-by');

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
