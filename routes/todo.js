var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


/* S'il n'y a pas de todolist 
on en crée une vide sous forme d'array avant la suite */
router.use(function(req, res, next){
    if (typeof(req.app.locals.todolist) == 'undefined') {
        req.app.locals.todolist = [];
    }
    next();
});

/* On affiche la todolist et le formulaire */
router.get('/', function(req, res) {
    if (!req.session.userName)
        res.redirect('/');
    else
    {
        var msg = 'Bonjour '+req.session.userName;
        res.render('todo.ejs', {title: msg, pseudo: req.session.userName, todolist: req.app.locals.todolist});
    }
});

/* On ajoute un élément à la todolist */
router.post('/ajouter/', urlencodedParser, function(req, res) {
    if (req.body.newtodo != '') {
        req.app.locals.todolist.push(req.body.newtodo);
    }
    res.redirect('/todo');
});

/* Supprime un élément de la todolist */
router.get('/supprimer/:id', function(req, res) {
    if (req.params.id != '') {
        req.app.locals.todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
});



module.exports = router;
