// Connexion à socket.io
var socket = io.connect('http://localhost:8080');

// On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
var pseudo = prompt('Quel est votre pseudo ?');
socket.emit('nouveau_client', pseudo);
document.title = pseudo + ' - ' + document.title;

// Quand on reçoit un message, on l'insère dans la page
socket.on('message', function(data) {
    insereMessage(data.pseudo, data.message)
})

// Quand un nouveau client se connecte, on affiche l'information
socket.on('nouveau_client', function(pseudo) {
    $('#zone_chat').append('<p><em>' + pseudo + ' a rejoint le tchat !</em></p>');
})

// Quand un client se deconnecte, on affiche l'information
socket.on('deconnexion_client', function(pseudo) {
    $('#zone_chat').append('<p><em>' + pseudo + ' a quitté le tchat !</em></p>');
})


// Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
$('#formulaire_chat').submit(function () {
    var message = $('#message').val();
    socket.emit('message', message); // Transmet le message aux autres
    insereMessage(pseudo, message); // Affiche le message aussi sur notre page
    $('#message').val('').focus(); // Vide la zone de Chat et remet le focus dessus
    return false; // Permet de bloquer l'envoi "classique" du formulaire
});

function horodate() {
    var date = new Date();
    var str = date.getHours();
    str += ':'+(date.getMinutes()<10?'0':'')+date.getMinutes();
    str += ':'+(date.getSeconds()<10?'0':'')+date.getSeconds();
    return str;
}

// Ajoute un message dans la page
function insereMessage(pseudo, message) {
    $('#zone_chat').append('<p>' + horodate() + ' : <strong>' + pseudo + '</strong> ' + message + '</p>');
}