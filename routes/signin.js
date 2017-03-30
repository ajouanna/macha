var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var ent = require('ent');
// var hash = require("mhash");
// var bcrypt = require('bcrypt');
// const saltRounds = 10;
const gencryption = require("gencryption"); 

var db = require('../dbconnect');
db.connect(function(err){
  if(err){
	console.log('Impossible de se connecter a la base de donnees');
  } else {
	console.log('Connexion a la base de donnees reussie');
  }
});
var status = "";


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
		if (!req.body.login || !req.body.mail || !req.body.firstname || !req.body.lastname || !req.body.password || 
			!req.body.passwordbis)
		{
			// afficher une erreur et attendre une nouvelle saisie
			status = 'Erreur ! Tous les champs doivent être remplis !';
			console.log(status);
			res.render('signin', { title: 'Projet Matcha', status: status});
			return;
		}
        // verifier le format du login 
        if (!req.body.login.match(/^[a-zA-Z0-9\-_]{3,8}$/)) {
            status="L'identifiant doit comprendre entre 3 et 8 caractères alphanumériques";
            res.render("signin", { title: 'Projet Matcha', status: status});
            return;
        }
        
        // verifier le format de l'email
        if (!req.body.mail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            status="Le format de l'adresse emmil est incorrect";
            res.render("signin", { title: 'Projet Matcha', status: status});
            return;
        }
        
        // verifier le format du mot de passe 
        if (!req.body.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/)) {
            status="L'identifiant doit comprendre 4 caractères minimum dont au moins 1 chiffre, une majuscule, une minuscule";
            res.render("signin", { title: 'Projet Matcha', status: status});
            return;
        }

        // verifier le format du prénom 
        if (!req.body.firstname.match(/^[a-zA-Z0-9\-_\.]{2,255}$/)) {
            status="Le prénom doit comprendre 2 caractères aphanumériques (ainsi que point, soulignement ou tiret) minimum";
            res.render("signin", { title: 'Projet Matcha', status: status});
            return;
        }
		
	    // verifier le format du nom 
        if (!req.body.lastname.match(/^[a-zA-Z0-9\-_\.]{2,255}$/)) {
            status="Le nom doit comprendre 2 caractères aphanumériques (ainsi que point, soulignement ou tiret) minimum";
            res.render("signin", { title: 'Projet Matcha', status: status});
            return;
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

		// var salt = bcrypt.genSaltSync(saltRounds);
		// var hash = bcrypt.hashSync(req.body.password, salt);
		var hash = gencryption.whirlpool({text: req.body.password});
		var record = {
			login: ent.encode(req.body.login),
			firstname: ent.encode(req.body.firstname),
			lastname: ent.encode(req.body.lastname),
			mail: ent.encode(req.body.mail),
			password: hash,
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
		});
	}
});

module.exports = router;