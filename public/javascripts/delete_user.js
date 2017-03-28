function delete_user(elem) {
	if(elem) {
		if (confirm("Voulez vous supprimer cet utilisateur ?")){
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/users/suppress', true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function() {
	        	if (this.readyState == 4 && this.status == 200) {
					console.log(this.responseText);
					if (this.responseText == 'Supression en base faite') {
						// en cas de succes cote serveur, supprimer toute la ligne 
						var parent = elem.parentNode;
						while (parent.firstChild) {
						  parent.removeChild(parent.firstChild);
						}
						parent.parentNode.removeChild(parent);
					}
	 	       	}
	 	    };
			var params = 'user=' + elem.innerHTML;
			xhr.send(params);
		}
	}
}