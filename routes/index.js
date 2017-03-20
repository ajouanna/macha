var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/* GET home page. */
router.get('/', function(req, res) { // TODO : verifier si next est necessaire ici
	if (req.session.userName)
		res.render('index', { title: 'Projet Matcha', pseudo: req.session.userName });
	else
		res.redirect('login');
});

module.exports = router;
