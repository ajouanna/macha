

// Ajoute un message dans la page
function reloadPage() {
	window.location.reload();
}

// Lorsqu'on envoie le formulaire, on transmet le message au serveur
$('#formulaire_todo').submit(function () {
    socket.emit('todo_update_vers_serveur'); // Transmet l'info de modif aux autres
    return true; // poursuit envoi du formulaire
});

// Lorsqu'on clique sur le lien, on transmet le message au serveur
$('.todo_item').click(function () {
    socket.emit('todo_update_vers_serveur'); // Transmet l'info de modif aux autres
    return true; // poursuit envoi du formulaire
});
