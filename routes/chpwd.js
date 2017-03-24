var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var ent = require('ent');
//var bcrypt = require('bcrypt');
//const saltRounds = 10;
const gencryption = require("gencryption"); 

var db = require('../dbconnect');
var status = "";

db.connect(function(err){
  if(err){
	status = 'Impossible de se connecter a la base de donnees';
	console.log(status);
	console.log(err);
	} else {
	console.log('Connexion a la base de donnees reussie');
  }
});

/* GET */
router.get('/:mail/:key', function(req, res) { 
		// je verifie la cle 
		if (!req.params.key || !req.params.mail)
			res.render('error', { message: 'clé ou mail manquant', error:''});
		else {
			// stocker les parametres dans la session 
			req.session.key = req.params.key;
			req.session.mail = ent.encode(req.params.mail);
			console.log('chpwd : get recu avec mail= ' + req.session.mail
			+ " et key = " + req.session.key);
			res.render('chpwd', { title: 'Projet Matcha', status: ''});
		} 
});

/*POST */
router.post('/', urlencodedParser, function(req, res) {
	if (typeof(req.body) == 'undefined')
	{
		return res.sendStatus(400);
	}
	else 
	{
		if (!req.session.key || !req.session.mail)
		{
			// afficher une erreur
			status = 'Erreur ! Valeurs de session vides... !';
			console.log(status);
			res.render('chpwd', { title: 'Projet Matcha', status: status});
			return; 
		}		
		console.log('chpwd : post recu avec mail= ' + req.session.mail
			+ " et key = " + req.session.key);

		if (!req.body.password || !req.body.passwordbis)
		{
			// afficher une erreur et attendre une nouvelle saisie
			status = 'Erreur ! Tous les champs doivent être remplis !';
			console.log(status);
			res.render('chpwd', { title: 'Projet Matcha', status: status});
			return; 
		}


        // verifier le format du mot de passe 
        if (!req.body.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/)) {
            status="L'identifiant doit comprendre 4 caractères minimum dont au moins 1 chiffre, une majuscule, une minuscule";
            res.render("chpwd", { title: 'Projet Matcha', status: status});
            return;
        }
        
		// verifier que les deux mdp saisis sont identiques
		if (req.body.password !== req.body.passwordbis)
		{
			// afficher une erreur et attendre une nouvelle saisie
			status = 'Erreur ! Mots de passe differents';
			console.log(status);
			res.render('chpwd', { title: 'Projet Matcha', status: status}); 
			return; 
		}

//		var salt = bcrypt.genSaltSync(saltRounds);
//		var hash = bcrypt.hashSync(req.body.password, salt);
		var hash = gencryption.whirlpool({text: req.body.password});

		var mail = ent.encode(req.session.mail);
		var cle = req.session.key;
		db.query("UPDATE user SET password = ? WHERE mail = ? AND cle = ?", 
			[hash, mail, cle],
			function(err, result){
 			if(err) { // cas d'erreur 
 				status = "Problème d'accès à la bdd";
 				console.log(status);
 				console.log(err);
				res.render('chpwd', { title: 'Projet Matcha', status: status}); 
 			}
            else if (result.affectedRows == 0) { // cas ou UPDATE n'a rien renvoye
				status = "Email/clé inconnus : mail = " + mail + "\ncle = " +cle;
 				console.log(status);
 				console.log(err);
				res.render('chpwd', { title: 'Projet Matcha', status: status}); 
            }
			else {
				console.log("Mot de passe modifie avec succes");
				// on nettoie la session
				req.session.mail = "";
				req.session.key = "";
				res.redirect('/'); // on va vers l'index
			}
		});
	}
});
module.exports = router;
