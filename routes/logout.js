var express = require('express');
var router = express.Router();

router.get('/', function(req, res) { // TODO : verifier si next est necessaire ici
		req.session = null;
		res.redirect('login');
});



module.exports = router;