var express = require('express');
var app = express();
var router = express.Router();

/* On affiche la page de tchat */
router.get('/', function(req, res) {
    if (!req.session.userName)
        res.redirect('/');
    else
    {
	    res.render('tchat.ejs', {title: 'Projet Matcha', pseudo: req.session.userName, profile: req.session.profile});
	}
});


module.exports = router;
