// Tableau contenant des chaines de caractères correspondant aux recherches stockées
var recherches = [];
// Chaine de caractères correspondant à la recherche courante
var recherche_courante;
// Tableau d'objets de type resultats (avec titre, date et url)
var recherche_courante_news = [];


function ajouter_recherche() {
  //déclenché quand click sur icone-disk de la zone 2 - en bas à gauche
	recherche_courante=$("#zone_saisie").val();
	var i = recherches.indexOf(recherche_courante);//attention c'est le indexOf de js (celui de util.js est différent)
	if (i==-1) {
		//ajout au tableau recherches
		recherches.push(recherche_courante);
		var s=$("#recherches-stockees").val();
		s=s+'<p class="titre-recherche">';
		s=s+'<label onclick="selectionner_recherche(this)" >'+recherche_courante+'</label>';
		s=s+'<img src="croix30.jpg" class="icone-croix" onclick="supprimer_recherche(this)"/>';
		s=s+'</p>';
		//append dans la zone 1 - en haut à gauche
		$("#recherches-stockees").append(s);
		//Create expiring cookie, 100 days from then:
		// var nameCookie="recherches";
		// var valueCookie=JSON.stringify(recherches);
		// var nbJours=100;
		// $.cookie(nameCookie, valueCookie, {expires: nbJours});

	} else {
		alert ("Déjà dans liste 1");
	}
}
}


function supprimer_recherche(elt) {
	//TODO ...
}


function selectionner_recherche(elt) {
	//TODO ...
}


function init() {
	//TODO ...
}


function rechercher_nouvelles() {
	//TODO ...
}


function maj_resultats(res) {
	//TODO ...
}


function sauver_nouvelle(elt) {
	//TODO ...
}


function supprimer_nouvelle(elt) {
	//TODO ...
}
