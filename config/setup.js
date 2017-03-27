// parametres de l'application
var config = { 
	mysql: {
	  host     : '127.0.0.1',
	  user     : 'root',
	  password : '',
	  database : 'matcha',
	  port : 3306 // valeur par defaut pour mysql
	  // port : 3307 // valeur a l'ecole 42
	  },
	mailserver: {
	    service: 'neuf',
        host: 'smtp.sfr.fr',
        auth: {
            user: 'antoine.jouannais@neuf.fr',
            pass: 'tOn1o0117'
		}
	}	
  };

module.exports = config;