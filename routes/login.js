var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var ent = require('ent');
const gencryption = require("gencryption"); 
var db = require('../dbconnect');
var status = "";
db.connect(function(err){
  if(err){
	console.log('Impossible de se connecter a la base de donnees');
  }else{
	console.log('Connexion a la base de donnees reussie');
  }
});

router.get('/', function(req, res) { // TODO : verifier si next est necessaire ici
	if (req.session.userName) // deja authentifie : on va a l'index
		res.redirect('/');
	else
		res.render('login', { title: 'Projet Matcha', status: ""}); // on affiche la page de login
});

router.post('/', urlencodedParser, function(req, res) {
	if (typeof(req.body) == 'undefined')
	{
		return res.sendStatus(400);
	}
	else 
	{
		if (!req.body.login || !req.body.password)
		{
			// afficher une erreur et attendre une nouvelle saisie
			status = 'Erreur ! Tous les champs doivent être remplis !';
			console.log(status);
			res.render('login', { title: 'Projet Matcha', status: status});
			return; 
		}

		// var salt = bcrypt.genSaltSync(saltRounds);
		// var hash = bcrypt.hashSync(req.body.password, salt);
		var hash = gencryption.whirlpool({text: req.body.password});

		db.query('SELECT * FROM user WHERE login = ? AND password = ?', [ent.encode(req.body.login), hash],
			function(err, records){
 			if(err) { // cas d'erreur ou cas ou le select n'a rien renvoye
 				status = "Erreur d'acces a la base";
 				console.log(status);
 				console.log(err);
				res.render('login', { title: 'Projet Matcha', status: status}); 
 			}
			else if (records.length == 0){
				status = 'Aucun utilisateur de correspond a ces informations';
 				console.log(status);
 				console.log(err);
				res.render('login', { title: 'Projet Matcha', status: status}); 
			}
 			else {
				console.log('Donnees recues de la base:\n');
	  			console.log(records);
				req.session.userName = ent.encode(req.body.login);
				req.session.profile = records[0].profile;
				console.log('LOGIN : Nouvelle session ouverte avec login = ' + req.session.userName + ' et profile = ' + req.session.profile);
				res.redirect('/'); // on va vers l'index
			}
		});
	}
});

module.exports = router;