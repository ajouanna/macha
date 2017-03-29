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
				res.render('essai', { title: 'Projet Matcha', status: status, data:{} }); 
 			}
			else if (records.length == 0){
				status = 'Aucun utilisateur de correspond a ces informations';
 				console.log(status);
 				console.log(err);
				res.render('essai', { title: 'Projet Matcha', status: status, data: {} }); 
			}
 			else {
			status = "";
				console.log('Donnees recues de la base:\n');
	  			console.log(records);
				res.render('essai', { title: 'Projet Matcha', status: status, data: records[0] }); 
			}
		});
    }
});

// POST appele par requete AJAX
router.post('/modify', urlencodedParser, function(req, res) { 
	status = "";
	if (typeof(req.body) == 'undefined')
	{
		return res.sendStatus(400);
	}
	else 
	{
		var record = {};
        // verifier le format de l'email
        if (req.body.mail) {
			if (!req.body.mail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            status="Le format de l'adresse email est incorrect";
            return res.send(status);
			}
			else {
				record['mail'] = ent.encode(req.body.mail);
			}
		}
		if (req.body.firstname)
			record['firstname'] = ent.encode(req.body.firstname);
		if (req.body.lastname)
			record['lastname'] = ent.encode(req.body.lastname);
		console.log(record);
		db.query('UPDATE User SET ? WHERE ?', [record, {login: req.session.userName}], function(err,result){
 			if(err) {
 				status = 'essai: Probleme acces base de donnees';
 				console.log(status);
 				console.log(err);
				return res.send(status);
 			}
 			else {
				status = 'essai : utilisateur modifie avec login = ' + req.session.userName;
				console.log(status);
				return res.send(status); 
			}
		});
	}
});

module.exports = router;