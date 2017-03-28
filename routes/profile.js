var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var ent = require('ent');
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


router.get('/', function(req, res) { 
	if (!req.session.userName) // pas authentifie : on va a l'index
		res.redirect('/');
	else {
        // on lit les infos en base
        
        
		db.query('SELECT * FROM user WHERE login = ?', [req.session.userName],
			function(err, records){
 			if(err) { // cas d'erreur ou cas ou le select n'a rien renvoye
 				status = "Erreur d'acces a la base";
 				console.log(status);
 				console.log(err);
				res.render('profile', { title: 'Projet Matcha', status: status, data:{} }); 
 			}
			else if (records.length == 0){
				status = 'Aucun utilisateur de correspond a ces informations';
 				console.log(status);
 				console.log(err);
				res.render('profile', { title: 'Projet Matcha', status: status, data: {} }); 
			}
 			else {
				console.log('Donnees recues de la base:\n');
	  			console.log(records);
				res.render('profile', { title: 'Projet Matcha', status: status, data: records[0] }); 
			}
		});
    }
});

router.post('/', urlencodedParser, function(req, res) { // TODO : verifier si next est necessaire ici
	if (typeof(req.body) == 'undefined')
	{
		return res.sendStatus(400);
	}
	else 
	{
        /*
		if (!req.body.login || !req.body.mail || !req.body.firstname || !req.body.lastname || !req.body.password || 
			!req.body.passwordbis)
		{
			// afficher une erreur et attendre une nouvelle saisie
			status = 'Erreur ! Tous les champs doivent être remplis !';
			console.log(status);
			res.render('signin', { title: 'Projet Matcha', status: status});
			return;
		}

        // verifier le format de l'email
        if (!req.body.mail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            status="Le format de l'adresse emmil est incorrect";
            res.render("signin", { title: 'Projet Matcha', status: status});
            return;
        }
        
        */

		var record = {
			firstname: ent.encode(req.body.firstname),
			lastname: ent.encode(req.body.lastname),
			mail: ent.encode(req.body.mail),
			sex: ent.encode(req.body.sex),
			orientation: ent.encode(req.body.orientation),
			bio: ent.encode(req.body.bio),
		};
		db.query('UPDATE User SET ? WHERE ?', [record, {login: req.session.userName}], function(err,result){
 			if(err) {
 				status = 'Probleme acces base de donnees';
 				console.log(status);
 				console.log(err);
 				// TODO : comment gere ce cas pour que la page ne soit pas reaffichee entierement mais qu un message d erreur 
 				// soit affiche ?????????
				// res.render('profile', { title: 'Projet Matcha', status: status}); 
 			}
 			else {
				console.log('profile : utilisateur modifie avec login = ' + req.session.userName);
				res.redirect('/profile'); 
			}
		});
	}
});

module.exports = router;