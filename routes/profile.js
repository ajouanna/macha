var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var ent = require('ent');
const gencryption = require("gencryption"); 
const path = require('path');
const fs = require('fs');
var db = require('../dbconnect');

db.connect(function(err){
  if(err){
	console.log('Impossible de se connecter a la base de donnees');
  } else {
	console.log('Connexion a la base de donnees reussie');
  }
});
var status = "";
var data = {};

router.get('/', function(req, res) { 
	if (!req.session.userName) // pas authentifie : on va a l'index
		res.redirect('/');
	else {
        // on lit les infos en base
        
        status = "";
		data = {
			record: [],
			genders : [],
			orientations : [], 
			// TODO : recuperer les photos en bdd
			photos : [{image_name: 'image_profile.jpg'}, {image_name: 'chien.jpg'}],
			// TODO : recuperer les tags en bdd
			tags: [{id: 0, description: "chiens"}, {id: 1, description: "nature"}]
			};
		db.query('SELECT * FROM user WHERE login = ?', [req.session.userName],
			function(err, records){
 			if(err) { // cas d'erreur 
 				status = "Erreur d'acces a la base";
 				console.log(status);
 				console.log(err);
				res.render('profile', { title: 'Projet Matcha', status: status, data: data }); 
 			}
			else if (records.length == 0) { // cas ou le select n'a rien renvoye
				status = 'Aucun utilisateur de correspond a ces informations';
 				console.log(status);
 				console.log(records);
				res.render('profile', { title: 'Projet Matcha', status: status, data: data }); 
			}
 			else {
				console.log('Donnees recues de la base:\n');
	  			console.log(records);
	  			db.query('SELECT id, description FROM Gender', function (err, genders) {
	  				if (err) throw err;
	  				console.log(genders);
	  				db.query('SELECT id, description FROM Orientation', function (err, orientations) {
	  				if (err) throw err;
	  				console.log(orientations);
					data.record = records[0];
					data.genders = genders;
					data.orientations = orientations;
					res.render('profile', { title: 'Projet Matcha', status: status, data: data }); 
					});
				});
			}
		});
    }
});

router.post('/modify', urlencodedParser, function(req, res) { // TODO : verifier si next est necessaire ici
	status = "";
	if (typeof(req.body) == 'undefined')
	{
		return res.sendStatus(400);
	}
	if (!req.session.userName) // pas authentifie : on va a l'index
		return res.redirect('/');
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

		if (req.body.firstname) {
			if (!req.body.firstname.match(/^[a-zA-Z0-9\-_\.]{2,255}$/)) {
				status = "Le format du prénom est incorrect (entre 2 et 255 caractères alphanumériques)";
				return res.send(status);
			}
			else
				record['firstname'] = ent.encode(req.body.firstname);
		}
		if (req.body.lastname) {
			if (!req.body.lastname.match(/^[a-zA-Z0-9\-_\.]{2,255}$/)) {
				status = "Le format du nom est incorrect (entre 2 et 255 caractères alphanumériques)";
				return res.send(status);
			}
			else
				record['lastname'] = ent.encode(req.body.lastname);
		}
		
		if (req.body.gender_id)
			record['gender_id'] = req.body.gender_id;
		if (req.body.orientation_id)
			record['orientation_id'] = req.body.orientation_id;
		if (req.body.bio)
			record['bio'] = ent.encode(req.body.bio);

		db.query('UPDATE User SET ? WHERE ?', [record, {login: req.session.userName}], function(err,result){
			if(err) {
 				status = 'profile: Probleme acces base de donnees';
 				console.log(status);
 				console.log(err);
				return res.send(status);
 			}
 			else {
				status = 'Ok';
				console.log(status);
				return res.send(status); 
			}
		});
	}
});


router.post('/suppress_photo', urlencodedParser, function(req, res) { // TODO : verifier si next est necessaire ici
	status = "";
	if (typeof(req.body) == 'undefined' || !req.body.img)
	{
		return res.sendStatus(400);
	}
	if (!req.session.userName) // pas authentifie : on va a l'index
		return res.redirect('/');
	else 
	{
		// supprimer l'image de la base
		var image_name = path.basename(req.body.img);
		console.log('debug : image_name = ' + image_name)
		db.query('DELETE FROM Image WHERE user_id = ? AND image_name = ?', [req.session.userName, image_name], function(err,result){
			if(err) {
 				status = 'profile: Probleme acces base de donnees sur suppression image';
 				console.log(status);
 				console.log(err);
				return res.send(status);
 			}
 			else {
 				if (result.affectedRows == 0)
 					console.log('suppress_photo : la photo n existait pas en base');
 				// suppression du fichier 
 				fs.unlink('./' + req.body.img, (err) => {
				  if (err)
				  	console.log('Erreur de suppression du fichier ' + req.body.img);
				  else
					console.log('Suppression reussie du fichier ' + req.body.img);
				});
				status = 'Ok';
				console.log(status);
				return res.send(status); 
			}
		});
	}
});


module.exports = router;