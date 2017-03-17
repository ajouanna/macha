var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/* GET home page. */
router.get('/', function(req, res) { // TODO : verifier si next est necessaire ici
	if (req.session.userName)
		res.redirect('/todo')
	else
		res.render('index', { title: 'Projet Matcha' });
});

router.post('/', urlencodedParser, function(req, res) { // TODO : verifier si next est necessaire ici
	if (typeof(req.body) == 'undefined')
	{
		console.log('Bizarre, pas de body dans un post ???');
		return res.sendStatus(400);
	}
	else 
	{
		req.session.userName = req.body.pseudo;
		res.redirect('/todo');
	}
});

module.exports = router;
