var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var ent = require('ent');
var hash = require("mhash");
var nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
        service: 'neuf',
        host: 'smtp.sfr.fr',
        auth: {
            user: 'antoine.jouannais@neuf.fr',
            pass: 'bidon'
    }
});

var db = require('../dbconnect');
var status = "";

/* GET */
router.get('/', function(req, res) { 
	if (!req.session.userName)
		res.render('reset', { title: 'Projet Matcha', status: status});
	else
		res.redirect('/');
});

/* POST */

router.post('/', urlencodedParser, function(req, res) {
	if (typeof(req.body) == 'undefined')
	{
		return res.sendStatus(400);
	}
	else 
	{
		if (!req.body.email)
		{
			// afficher une erreur et attendre une nouvelle saisie
			status = "Erreur ! L'adresse email doit être remplie !";
			console.log(status);
			res.render('reset', { title: 'Projet Matcha', status: status});
			return; 
		}
        var mail = ent.encode(req.body.email);
		db.connect(function(err){
		  if(err){
		    console.log('Impossible de se connecter a la base de donnees');
		  }else{
		    console.log('Connexion a la base de donnees reussie');
		  }
		});
        var maDate = new Date();
        var alea = maDate.getTime();
        var cle = hash('md5', alea.toString());
        console.log('alea = ' + alea.toString() + '\ncle = ' + cle);
		db.query("UPDATE user SET cle = ? WHERE mail = ?", [cle, mail],
			function(err, result){
 			if(err) { // cas d'erreur 
 				status = "Problème d'accès à la bdd";
 				console.log(status);
 				console.log(err);
				res.render('reset', { title: 'Projet Matcha', status: status}); 
 			}
            else if (result.affectedRows == 0) { // cas ou UPDATE n'a rien renvoye
				status = "Email inconnu : " + mail;
 				console.log(status);
 				console.log(err);
				res.render('reset', { title: 'Projet Matcha', status: status}); 
            }
 			else {
				console.log('Donnees recues de la base:\n');
	  			console.log(result);
                var msg = "Pour changer votre mot de passe au service Matcha, cliquez sur ce lien : xxxxxxxxxxxxxxx"
                // setup email data with unicode symbols
                var mailOptions = {
                    from: '"Antoine Jouannais" <ajouanna@student.42.fr>', // sender address
                    to: mail, // list of receivers
                    subject: 'Matcha : renouvellement de votre mot de passe', // Subject line
                    text: 'Bonjour\n' + msg, // plain text body
                    html: '<b>Bonjour</b><br>' + msg // html body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                });                
                
                res.redirect('/'); // on va vers l'index
			}
			// db.end();
		});
	}
});


module.exports = router;
