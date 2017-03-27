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

/* GET home page. */
router.get('/', function(req, res) { // TODO : verifier si next est necessaire ici
	if (req.session.userName) {
		db.query('SELECT * FROM user',
			function(err, records){
 			if(err) { // cas d'erreur ou cas ou le select n'a rien renvoye
 				status = "Erreur d'acces a la base";
 				console.log(status);
 				console.log(err);
				res.render('index', 
					{ 	title: 'Projet Matcha', 
						pseudo: req.session.userName,
						profile : req.session.profile,
						status: status,
						num_users: 'inconnu'}); 
 			}
 			else {
				console.log('Donnees recues de la base:\n');
	  			console.log(records);
				res.render('index', 
				{ 	title: 'Projet Matcha', 
					pseudo: req.session.userName, 
					profile : req.session.profile,
					status: "",
					num_users: records.length});
					}
				});
	}
	else
		res.redirect('login');
});

module.exports = router;
