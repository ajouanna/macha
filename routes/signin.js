var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var ent = require('ent');
var hash = require("mhash");

var db = require('../dbconnect');


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
		var status = "";
		if (!req.body.login || !req.body.mail || !req.body.firstname || !req.body.lastname || !req.body.password || 
			!req.body.passwordbis)
		{
			// afficher une erreur et attendre une nouvelle saisie
			status = 'Erreur ! Tous les champs doivent être remplis !';
			console.log(status);
			res.render('signin', { title: 'Projet Matcha', status: status});
			return; // TBD : comment sortir en erreur proprement ?
		}
		// verifier que les deux mdp saisis sont identiques
		if (req.body.password !== req.body.passwordbis)
		{
			// afficher une erreur et attendre une nouvelle saisie
			status = 'Erreur ! Mots de passe differents';
			console.log(status);
			res.render('signin', { title: 'Projet Matcha', status: status}); 
			return; // TBD : comment sortir en erreur proprement ?
		}
		db.connect(function(err){
		  if(err){
		    console.log('Impossible de se connecter a la base de donnees');
		  }else{
		    console.log('Connexion a la base de donnees reussie');
		  }
		});
		var record = {
			login: ent.encode(req.body.login),
			firstname: ent.encode(req.body.firstname),
			lastname: ent.encode(req.body.lastname),
			mail: ent.encode(req.body.mail),
			password: hash('whirlpool', req.body.password),
			profile: 'NORMAL'
		};
		db.query('INSERT INTO User SET ?', record, function(err,result){
 			if(err) {
 				status = 'Impossible de creer cet utilisateur';
 				console.log(status);
 				console.log(err);
				res.render('signin', { title: 'Projet Matcha', status: status}); 
 			}
 			else {
				req.session.userName = ent.encode(req.body.login);
				req.session.profile = 'NORMAL'; // par ce biais, on ne peut pas creer d'ADMIN
				console.log('SIGNIN : Nouvel utilisateur cree et session ouverte avec login = ' + req.session.userName);
				res.redirect('/'); // on va vers l'index
			}
			db>end();
		});
	}
});

module.exports = router;