var list_mot = ["chien","chat","maison","interface","variable","plage","montagne","voiture","restaurant","vacances","musique","film","livre","guitare","pizza","football","basketball","voyage","jardin","famille","amis","soleil","lune"];
var tab_meilleurs = []; // tableau pour stocker les 10 meilleurs joueurs

var mot = tirer_Mot_Au_Hasard().toUpperCase();
var nbr_lettres = mot.length;
var nbr_lettre_devinees = 0;
var nbr_penalites = 0;
var jouer = true;
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var temp_debut;
var temp_fin;
var temp;

var div_main = $("#main");

var div_cases_lettres = $("<div>", {id : "cases_lettres"}); // cases pour contenir les lettres devinées
div_main.append(div_cases_lettres);

var div_cases_alphabet = $("<div>", {id : "cases_alphabet"}); // crer des cases qui contient les lettres de l'alphabet
div_main.append(div_cases_alphabet);


var button_start = $("<button>",  {class : "bn"}).html("Recommencer");
div_main.append(button_start);

var div_fenetre_resltat = $("<div>", {class: "fenetre_resltat"});
div_main.append(div_fenetre_resltat);

var message = $("<div>", {id : "message"});
div_fenetre_resltat.append(message);


function tirer_Mot_Au_Hasard(){
    var i = parseInt(Math.random() * list_mot.length);
    return list_mot[i];
}

function test_si_lettre_dans_mot(lettre){
    for(let i=0; i<nbr_lettres; i++){
        if (mot[i] == lettre){
            return true;
        } 
    }
    return false;
}

function afficher_lettre(lettre){
    for(let i=0; i<nbr_lettres; i++){
        if (mot[i] == lettre){
            var id_case = "l_" + i;
            $("#" + id_case).html(mot[i]);
            nbr_lettre_devinees ++;
        } 
    }
}   

function creerCasesVidesPourMot(){ // crer des cases pour contenir les lettres devinées
    div_cases_lettres.html("");
    for(let i=0; i<nbr_lettres; i++){
        var div_case_lettre = $("<div>" , {class : "case_lettre", text : "   ", id : "l_" + i});
        div_cases_lettres.append(div_case_lettre);
    }
}

function generer_cases_alphabet(lettres){
    var rang = $("<div>");
    div_cases_alphabet.append(rang);

    for(let i=0; i<lettres.length; i++){
        var lettre_alphabet = lettres[i];
        var div_case_alphabet = $("<div>", {class : "lettre_alphabet"});
        div_case_alphabet.html(lettre_alphabet);
        rang.append(div_case_alphabet);
    }
}

function generer_tableau_meuilleurs_joeurs(){
    var table = $("<table>");
    
    var row1 = $("<tr>");
    row1.append($("<th>").html("Rang"));
    row1.append($("<th>").html("Nom"));
    row1.append($("<th>").html("Nb"));
    row1.append($("<th>").html("Temps"));

    table.append(row1);

    for(let i=1; i<= 10; i++){
        var row = $("<tr>");
        row.append($("<th>").html(i));
        row.append($("<td>", {id: i + "_1", text : "xxx"}));
        row.append($("<td>", {id: i + "_2", text : "xxx"}));
        row.append($("<td>", {id: i + "_3", text : "xxx"}));

        table.append(row);
    }
    
    div_main.append(table);
}

function remplirTableauHTML(){
    for(let i=0; i<tab_meilleurs.length; i++){  // remplir le tableau dans la page html
        var id_nom = (i+1) + "_" + 1;
        var id_Nb = (i+1) + "_" + 2;
        var id_Temps = (i+1) + "_" + 3;
                    
        $("#" + id_nom).html(tab_meilleurs[i].nom);
        $("#" + id_Nb).html(tab_meilleurs[i].score);
        $("#" + id_Temps).html(tab_meilleurs[i].time);
    }
}

function messagePerte(){
    message.html("Vous avez perdu, le mot était \""+ mot +"\" ");  
}
function messageGagne(){
    message.html("Félicitations, vous avez gagné");
}

function reinitialiser(){
    mot = tirer_Mot_Au_Hasard().toUpperCase();
    nbr_lettres = mot.length;
    nbr_lettre_devinees = 0;
    nbr_penalites = 0;
    jouer = true;

    // reinitialiser l'affichage les cases d'affichage du mot
    creerCasesVidesPourMot();

    $(".lettre_alphabet.desactive").on("click", clickLettre);
    $(".lettre_alphabet.desactive").css("background-color", "");
    $(".lettre_alphabet.desactive").removeClass("desactive");
    document.getElementById("svg-container").innerHTML="";
    
    message.html("");
}

function comparerScore(a, b) { // fonction de tri des joueurs en fonction des étapes et du temps mis pour trouver la bonne réponse
    if(a.score != b.score){
        return a.score - b.score;
    }
    else{
        return a.time - b.time;
    }
    
}

function ajoutMeuilleurjoeur(){
    if (tab_meilleurs.length < 10 || nbr_penalites < tab_meilleurs[tab_meilleurs.length - 1].score) {
                
        var label_input_name = $("<label>").html("Bravo, vous êtes dans les 10 meilleurs, entrez votre nom : ");
        message.append(label_input_name);
            
        var input_name = $("<input>");
        message.append(input_name);
        
        input_name.keydown(function(event){
            if(event.which === 13){
                console.log("retour chariot")

                var nom = this.value;
                var joueur = { nom: nom, score: nbr_penalites, time:temp };
                console.log(joueur);
                tab_meilleurs.push(joueur);
                tab_meilleurs.sort(comparerScore);
                
        
                if (tab_meilleurs.length > 10) {
                    tab_meilleurs.pop(); // Supprime le dernier élément si le tableau dépasse 10 joueurs
                }

                // stocker le tableau des meilleurs dans le localStorage
                localStorage["tableauObjet"] = JSON.stringify(tab_meilleurs);
                // récupérer le tabeleau
                tab_meilleurs = JSON.parse(localStorage["tableauObjet"]); 
        
                remplirTableauHTML();
                
               // message.html("Vous êtes classé " + (tab_meilleurs.indexOf(joueur) + 1) + " parmi les meilleurs !");
               message.html("Vous êtes classé " + trouverClassementJoeur(joueur) + " parmi les meilleurs !");


            }   
        });

    }
}

function trouverClassementJoeur(joeur){
    for(var i=0; i<tab_meilleurs.length; i++){
        if(tab_meilleurs[i].nom === joeur.nom && tab_meilleurs[i].score === joeur.score && tab_meilleurs[i].time === joeur.time){
            return i + 1;
        }
    }

    return -1;
}

function clickLettre(){
    let lettre = this.innerHTML;
    if(jouer){
        if(nbr_lettre_devinees == 0 && nbr_penalites == 0){
            temp_debut = new Date;
        }

        if(test_si_lettre_dans_mot(lettre)) {
            afficher_lettre(lettre);
            if(nbr_lettre_devinees == nbr_lettres){ // si le mot est trouvé
                temp_fin = new Date;
                temp = (temp_fin - temp_debut) / 1000 ;
                jouer = false; // arreter jeu
                messageGagne(); //afficher vous avez gagne
                ajoutMeuilleurjoeur();    
            }
        }
        else{
            nbr_penalites ++;
            drawHangmanPart(nbr_penalites);
            if(nbr_penalites > 6){
                jouer = false; // arreter jeu
                messagePerte(); // afficher vous aver perdu
            }
        }
        $(this).off("click");
        $(this).addClass("desactive");
        $(this).css("background-color", "gray");

        $(this).addClass("vibration");
        setTimeout(() => {
            $(this).removeClass('vibration');
        }, 300);
    }
    console.log(lettre);
}

function drawHangmanPart(part) {
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.getElementById("svg-container");

    // Ajouter des parties du pendu en fonction du paramètre
    switch (part) {
        case 1:
            // Dessiner la potence
            var line1 = document.createElementNS(svgNS, "line");
            line1.setAttribute("x1", "20");
            line1.setAttribute("y1", "230");
            line1.setAttribute("x2", "120");
            line1.setAttribute("y2", "230");
            line1.setAttribute("stroke", "white");
            line1.setAttribute("stroke-width", "5");
            svg.appendChild(line1);
            break;
        case 2:
            // Dessiner la poutre horizontale
            var line2 = document.createElementNS(svgNS, "line");
            line2.setAttribute("x1", "50");
            line2.setAttribute("y1", "20");
            line2.setAttribute("x2", "60");
            line2.setAttribute("y2", "230");
            line2.setAttribute("stroke", "white");
            line2.setAttribute("stroke-width", "5");
            svg.appendChild(line2);
            break;
        case 3:
            // Dessiner la corde
            var line3 = document.createElementNS(svgNS, "line");
            line3.setAttribute("x1", "47");
            line3.setAttribute("y1", "20");
            line3.setAttribute("x2", "150");
            line3.setAttribute("y2", "20");
            line3.setAttribute("stroke", "white");
            line3.setAttribute("stroke-width", "5");
            svg.appendChild(line3);
            break;
        
        case 4:
            // Dessiner la tête
            var circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", "155");
            circle.setAttribute("cy", "50");
            circle.setAttribute("r", "30");
            circle.setAttribute("fill", "none");
            circle.setAttribute("stroke", "white");
            circle.setAttribute("stroke-width", "5");
            svg.appendChild(circle);
            break;
        case 5:
            // Dessiner la corde
            var line4 = document.createElementNS(svgNS, "line");
            line4.setAttribute("x1", "155");
            line4.setAttribute("y1", "77");
            line4.setAttribute("x2", "155");
            line4.setAttribute("y2", "180");
            line4.setAttribute("stroke", "white");
            line4.setAttribute("stroke-width", "5");
            svg.appendChild(line4);
            break;

    case 7:
            // Dessiner la corde
            var line5 = document.createElementNS(svgNS, "line");
            var line6 = document.createElementNS(svgNS, "line");
            line5.setAttribute("x1", "180");
            line5.setAttribute("y1", "200");
            line5.setAttribute("x2", "155");
            line5.setAttribute("y2", "150");
            line5.setAttribute("stroke", "white");
            line5.setAttribute("stroke-width", "5");
            svg.appendChild(line5);

            line6.setAttribute("x1", "130");
            line6.setAttribute("y1", "200");
            line6.setAttribute("x2", "155");
            line6.setAttribute("y2", "150");
            line6.setAttribute("stroke", "white");
            line6.setAttribute("stroke-width", "5");
            svg.appendChild(line6);
            break;
    case 6:
            // Dessiner la corde
            var line7 = document.createElementNS(svgNS, "line");
            var line8 = document.createElementNS(svgNS, "line");
            line7.setAttribute("x1", "180");
            line7.setAttribute("y1", "120");
            line7.setAttribute("x2", "155");
            line7.setAttribute("y2", "100");
            line7.setAttribute("stroke", "white");
            line7.setAttribute("stroke-width", "5");
            svg.appendChild(line7);
            
            line8.setAttribute("x1", "130");
            line8.setAttribute("y1", "120");
            line8.setAttribute("x2", "155");
            line8.setAttribute("y2", "100");
            line8.setAttribute("stroke", "white");
            line8.setAttribute("stroke-width", "5");
            svg.appendChild(line8);
            
            break;
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
creerCasesVidesPourMot();

generer_cases_alphabet(alphabet.substring(0,10)); // rang 1
generer_cases_alphabet(alphabet.slice(10,19)); // rang 2
generer_cases_alphabet(alphabet.slice(19,26)); // rang 3

if("tableauObjet" in localStorage){
    tab_meilleurs = JSON.parse(localStorage["tableauObjet"]);
} 

generer_tableau_meuilleurs_joeurs();
remplirTableauHTML();

$("div .lettre_alphabet").click(clickLettre);

button_start.click(reinitialiser);

$("div .lettre_alphabet").css("color", "red");
