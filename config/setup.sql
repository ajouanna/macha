CREATE DATABASE IF NOT EXISTS matcha;

USE matcha;

CREATE TABLE IF NOT EXISTS `Gender` (
			`id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, `description` varchar(255) NOT NULL ) ;

CREATE TABLE IF NOT EXISTS `Orientation` (
			`id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, `description` varchar(255) NOT NULL ) ;

CREATE TABLE IF NOT EXISTS `User` ( 
			`login` varchar(8) NOT NULL, 
			`mail` varchar(255) NOT NULL, 
			`password` varchar(320) NOT NULL,
			`firstname` varchar(255) NOT NULL,
			`lastname` varchar(255) NOT NULL,
			`profile` ENUM('NORMAL', 'ADMIN') NOT NULL,
			`creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			`cle` varchar(32),
            `gender_id` INT UNSIGNED,
            `orientation_id` INT UNSIGNED,
            `bio` VARCHAR (500),
            PRIMARY KEY (login),
            FOREIGN KEY (gender_id) REFERENCES Gender (id),
            FOREIGN KEY (orientation_id) REFERENCES Orientation (id),
			CONSTRAINT uc_mail UNIQUE (`mail`) /* unicite du mail dans la base */
		) ;

    
CREATE TABLE IF NOT EXISTS `Image` ( 
			`id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			`user_id` VARCHAR(8) NOT NULL, 
			`image_name` varchar(255) NOT NULL, 
			`creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
		);

CREATE TABLE IF NOT EXISTS `Comment` ( 
			`id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			`description` varchar(255) NOT NULL, 
			`image_id` INT NOT NULL, 
			`liker_id` VARCHAR(8) NOT NULL, 
			`creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
		);

CREATE TABLE IF NOT EXISTS `Like_table` ( 
			`id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			`image_id` INT NOT NULL, 
			`liker_id` VARCHAR(8) NOT NULL, 
			`creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			CONSTRAINT uc_image_liker UNIQUE (`image_id`, `liker_id`) /* je ne veux qu'un seul like par user et par image*/
		);

CREATE TABLE IF NOT EXISTS `Tag` ( 
			`id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			`description` varchar(255) NOT NULL
    );

/* relation N to N entre user et tag */
CREATE TABLE IF NOT EXISTS `user_to_tag` (
			`user_id` VARCHAR(8) NOT NULL, 
            `tag_id` INT NOT NULL,
            PRIMARY KEY (user_id, tag_id)
);

/* creation de quelques enregistrements en bdd */
INSERT INTO Gender (description) VALUES ('Inconnu');
INSERT INTO Gender (description) VALUES ('Homme');
INSERT INTO Gender (description) VALUES ('Femme');
INSERT INTO Gender (description) VALUES ('Trans');

INSERT INTO Orientation (description) VALUES ('Inconnu');
INSERT INTO Orientation (description) VALUES ('Hétéro');
INSERT INTO Orientation (description) VALUES ('Homo');
INSERT INTO Orientation (description) VALUES ('Bi');

INSERT INTO User (login, mail, password, profile, firstname, lastname, bio, gender_id) SELECT 
	'admin', 
	'ajouanna@hotmail.com', 
	'2f9959b230a44678dd2dc29f037ba1159f233aa9ab183ce3a0678eaae002e5aa6f27f47144a1a4365116d3db1b58ec47896623b92d85cb2f191705daf11858b8', 
	'ADMIN', 
	'Anabelle',
	'Jovanotti',
	"C'est l'unique administrateur de ce site",
	id FROM Gender WHERE description='Femme'; 


INSERT INTO Image (user_id, image_name) VALUES ('admin','chien.jpg');

