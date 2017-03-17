# matcha
ce projet commence comme un TD de openclassroom et deviendra ensuite 
un site de rencontre (projet matcha de l'Ecole 42)...

La premiere chose a faire pour completer l'installation : npm install
Puis lancer : node app.js

Infos concernant le projet en l'état :
- la structure du projet a été faite avec express-generator
- j'ai ensuite mixé 2 TD d'openclassroom, la todo list et le tchat, en les mettant chacun sous une route
- puis j'ai modifié la todo pour utiliser socket.io et faire en sorte qu'à chaque modif
sur la liste stockée dans un espace unique (sous app.locals), les pages de tous les clients
soient réaffichées. Ca n'est pas optimal en terme d'usage réseau (ça serait mieux de
ne réafficher que ce qui est nouveau) mais ça marche.
Je n'ai pas essayé de faire 2 modifs en même temps sur 2 clients par exemple... 
Je ne serais pas étonné que certains cas posent problème... 

