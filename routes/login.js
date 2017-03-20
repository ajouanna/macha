var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var ent = require('ent');


router.get('/', function(req, res) { // TODO : verifier si next est necessaire ici
	if (req.session.userName) // deja authentifie : on va a l'index
		res.redirect('/');
	else
		res.render('login', { title: 'Projet Matcha'}); // on affiche la page de login
});

router.post('/', urlencodedParser, function(req, res) { // TODO : verifier si next est necessaire ici
	if (typeof(req.body) == 'undefined')
	{
		console.log('Bizarre, pas de body dans un post ???');
		return res.sendStatus(400);
	}
	else 
	{
		req.session.userName = ent.encode(req.body.pseudo);
		console.log('Nouvelle session ouverte avec pseudo = ' + req.session.userName);
		res.redirect('/'); // on va vers l'index
	}
});

module.exports = router;