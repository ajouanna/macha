CREATE DATABASE IF NOT EXISTS matcha;

USE matcha;

CREATE TABLE IF NOT EXISTS `User` ( 
			`login` varchar(8) NOT NULL, 
			`mail` varchar(255) NOT NULL, 
			`password` varchar(255) NOT NULL,
			`firstname` varchar(255) NOT NULL,
			`lastname` varchar(255) NOT NULL,
			`profile` ENUM('NORMAL', 'ADMIN') NOT NULL,
			`creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			`cle` varchar(32),
			PRIMARY KEY (login),
			CONSTRAINT uc_mail UNIQUE (`mail`) /* unicite du mail dans la base */
		) ;

INSERT INTO User (login, mail, password, profile, firstname, lastname) VALUES 
(	'admin', 
	'ajouanna@hotmail.com', 
	'2f9959b230a44678dd2dc29f037ba1159f233aa9ab183ce3a0678eaae002e5aa6f27f47144a1a4365116d3db1b58ec47896623b92d85cb2f191705daf11858b8', 
	'ADMIN', 
	'Antoine',
	'Jouannais'); 