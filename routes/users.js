var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var ent = require('ent');
var status = "";

var db = require('../dbconnect');
db.connect(function(err){
  if(err){
	status = "Impossible de se connecter a la base de donnees";
	console.log(status);
  } 
  else {
	 status = "Connexion a la base de donnees reussie";
	 console.log(status);
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
	if (req.session.userName && req.session.profile == 'ADMIN') {
		// lister les users dans la bdd et passer la liste au template
		db.query('SELECT * FROM user',
			function(err, records){
 			if(err) { // cas d'erreur ou cas ou le select n'a rien renvoye
 				status = "Erreur d'acces a la base";
 				console.log(status);
 				console.log(err);
				res.render('users', { title: 'Projet Matcha', status: status, users: records}); 
 			}
 			else {
				console.log('Donnees recues de la base:\n');
	  			console.log(records);
				for (var i in records) {
					console.log(records[i].login+"\n");
				}
				res.render('users', { title: 'Projet Matcha', status : "", users: records });
			}
		});
	}
	else
		res.redirect('/');
});

router.post('/suppress', urlencodedParser, function(req, res) { 
	if (typeof(req.body) == 'undefined')
	{
		return res.sendStatus(400);
	}
	else 
	{
		if (!req.body.user)
		{
			// afficher une erreur 
			status = 'Erreur ! Le champ user est manquant !';
			console.log(status);
			return res.sendStatus(400);
		}
		var user = req.body.user;
		db.query('DELETE FROM user WHERE login = ?', [user], function(err,result){
			console.log("Resultat du DELETE : " + result);
 			if(err) {
 				status = 'Impossible de supprimer utilisateur ' + user;
 				console.log(status);
 				console.log(err);
				return res.sendStatus(500);			
 			}
			else if (result.affectedRows == 0) {
				status = "Utilisateur " + user + " inexistant";
				console.log(status);
				console.log(result);
				return res.send(status);
			}
 			else {
				status = "Supression en base faite"; // attention : cette chaine est attendue cote client, voir delete_user.js
				console.log(status);
				return res.send(status);
			}
		});
	}
});
module.exports = router;
