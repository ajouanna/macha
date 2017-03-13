var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


/* S'il n'y a pas de todolist dans la session,
on en crée une vide sous forme d'array avant la suite */
router.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }
    next();
});

/* On affiche la todolist et le formulaire */
router.get('/', function(req, res) {
    res.render('todo.ejs', {todolist: req.session.todolist});
});

/* On ajoute un élément à la todolist */
router.post('/ajouter/', urlencodedParser, function(req, res) {
    if (req.body.newtodo != '') {
        req.session.todolist.push(req.body.newtodo);
    }
    res.redirect('/');
});

/* Supprime un élément de la todolist */
router.get('/supprimer/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
});

/* On redirige vers la todolist si la page demandée n'est pas trouvée */
/*
router.use(function(req, res, next){
    res.redirect('/todo');
});
*/

module.exports = router;
