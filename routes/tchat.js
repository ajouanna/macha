var express = require('express');
var app = express();
var router = express.Router();

/* On affiche la page de tchat */
router.get('/', function(req, res) {
    res.render('tchat.ejs');
});


module.exports = router;
