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
		res.render('signin', { title: 'Projet Matcha', status: ''}); // on affiche la page de signin
});

router.post('/', urlencodedParser, function(req, res) { // TODO : verifier si next est necessaire ici
	if (typeof(req.body) == 'undefined')
	{
		return res.sendStatus(400);
	}
	else 
	{
		req.session.userName = ent.encode(req.body.pseudo);
		req.session.mail = ent.encode(req.body.mail);
		req.session.password = hash('whirlpool', req.body.password);

		// verifier que les deux mdp saisis sont identiques
		if (!req.body.password || !req.body.passwordbis || req.body.password !== req.body.passwordbis)
		{
			// afficher une erreur et attendre une nouvelle saisie
			console.log('Erreur ! Mots de passe differents ou vides');
			res.render('signin', { title: 'Projet Matcha', status: 'Erreur ! Mots de passe differents ou vides'}); 
			//res.status(200).send('Erreur ! Mots de passe differents ou vides');
		}
		else
		{ 
			// verifier que ce user n'existe pas deja
			// TODO

			// verifier que ce mail n'existe pas deja
			// TODO
			console.log('SIGNIN : Nouvel utilisateur cree et session ouverte avec pseudo = ' + 
				req.session.userName + '\nmail = ' + req.session.mail + '\nmdp = ' + req.session.password);
			res.redirect('/'); // on va vers l'index
		}
	}
});

module.exports = router;