var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var ent = require('ent');
var hash = require("mhash");


router.get('/', function(req, res) { // TODO : verifier si next est necessaire ici
	if (req.session.userName) // deja authentifie : on va a l'index
		res.redirect('/');
	else
		res.render('login', { title: 'Projet Matcha'}); // on affiche la page de login
});

router.post('/', urlencodedParser, function(req, res) { // TODO : verifier si next est necessaire ici
	if (typeof(req.body) == 'undefined')
	{
		return res.sendStatus(400);
	}
	else 
	{
		req.session.userName = ent.encode(req.body.pseudo);
		req.session.password = hash('whirlpool', req.body.password);
		console.log('LOGIN : Nouvelle session ouverte avec pseudo = ' + req.session.userName + '\nmdp = ' + req.session.password);
		res.redirect('/'); // on va vers l'index
	}
});

module.exports = router;