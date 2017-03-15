// Connexion à socket.io
var socket = io();


// Quand on reçoit l'info que la liste a été mise à jour, un message, on rechage la page
socket.on('todo_update_vers_clients', function() {
    reloadPage();
})

// Ajoute un message dans la page
function reloadPage() {
	window.location.reload();
}

// Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
$('#formulaire_todo').submit(function () {
    socket.emit('todo_update_vers_serveur'); // Transmet l'info de modif aux autres
    return true; // poursuit envoi du formulaire
});