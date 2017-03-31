 

function change_profile(elem) {
	if(elem) 
	{
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/profile/modify', true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function() {
	        	if (this.readyState == 4 && this.status == 200) {
					console.log(this.responseText);
					var status_msg = document.getElementById('status_msg');
					console.log(status_msg);
					if (this.responseText != 'Ok') { // protocole custom : autre chose que Ok signifit un probleme
						// en cas de probleme cote serveur, ecrire le message renvoye dans le champ de status 			
						status_msg.innerHTML = this.responseText;
					}
					else {
						status_msg.innerHTML = "";
					}
	 	       	}
	 	    };
			// recuperer le ou les champs input a transmettre faisant partie du même formulaire
			var params = "";
			var parent=elem.parentNode;
			console.log(parent);
			var elems=parent.querySelectorAll('input[type="text"], input[type="email"], select, textarea');
			console.log(elems);
			for ( var i = 0, c = elems.length ; i < c; i++) {
				if (params.length > 0)
					params += '&';
				params += elems[i].name + '=' + elems[i].value;
			}
			console.log(params);
			xhr.send(params);
	}
}


function delete_photo(elem) {
	if(elem) {
		if (confirm("Voulez vous supprimer cette photo ?")){
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/profile/suppress_photo', true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function() {
	        	if (this.readyState == 4 && this.status == 200) {
					console.log(this.responseText);
					if (this.responseText == 'Ok') {
						// en cas de succes cote serveur, supprimer toute la ligne 
						var parent = elem.parentNode;
						while (parent.firstChild) {
						  parent.removeChild(parent.firstChild);
						}
						parent.parentNode.removeChild(parent);
					}
	 	       	}
	 	    };
	 	    console.log('debug : elem.src = ' + elem.src);
			var params = 'img=' + elem.src;
			xhr.send(params);
		}
	}
}

