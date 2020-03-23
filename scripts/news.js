// Tableau contenant des chaines de caractères correspondant aux recherches stockées
var recherches = [];
// Chaine de caractères correspondant à la recherche courante
var recherche_courante;
// Tableau d'objets de type resultats (avec titre, date et url)
var recherche_courante_news = [];


function ajouter_recherche() {
  //déclenché quand click sur icone-disk de la zone 2 - en bas à gauche
	recherche_courante=$("#zone_saisie").val();
	// ou
	// var c=document.getElementById("zone_saisie");
	// recherche_courante=c.value;
	var i = recherches.indexOf(recherche_courante);//attention c'est le indexOf de js (celui de util.js est différent)
	if (i==-1) {
		//ajout au tableau recherches
		recherches.push(recherche_courante);
		var s=$("#recherches-stockees").val();
		s=s+'<p class="titre-recherche">';
		s=s+'<label onclick="selectionner_recherche(this)" >'+recherche_courante+'</label>';
		s=s+'<img src="img/croix30.jpg" class="icone-croix" onclick="supprimer_recherche(this)"/>';
		s=s+'</p>';
		//append dans la zosne 1 - en haut à gauche
		$("#recherches-stockees").append(s);
		// ou
		// var s=document.getElementById("recherches-stockees").innerHTML;
		// s=s+'<p class="titre-recherche"><label onclick="selectionner_recherche(this)" >'+c.value+'</label><img src="img/croix30.jpg" class="icone-croix" onclick="supprimer_recherche(this)"/> </p>';
		// document.getElementById("recherches-stockees").innerHTML=s;

		//Create expiring cookie, 100 days from then:
		// var nameCookie="recherches";
		// var valueCookie=JSON.stringify(recherches);
		// var nbJours=100;
		// $.cookie(nameCookie, valueCookie, {expires: nbJours});

		//localstorage
		//localStorage.setItem(name,value);
		//localStorage.getItem(name);
		var name="recherches";
		var value=JSON.stringify(recherches);
		localStorage.setItem(name,value);

	} else {
		alert ("Déjà dans liste !");
	}
}

function supprimer_recherche(e){
	// e est le child du paragraphe p;

	// e.parentNode.removeChild(e); ne retire que la croix
	var elt_p=e.parentNode;
	var elt_pp=elt_p.parentNode ;
	elt_pp.removeChild(elt_p) ;


	var x = e.parentNode.querySelector("label").innerHTML; //contenu du label
	var i=recherches.indexOf(x);
	recherches.splice(i,1); //suppression de 1 seul elt à l'indice i

	// var nameCookie="recherches";
	// var valueCookie=JSON.stringify(recherches);
	// var nbJours=100;
	// $.cookie(nameCookie, valueCookie, { expires: nbJours});
	//alert("valueCookie"+valueCookie);
	//Create expiring cookie, 100 days from then

	//localStorage
	var name="recherches";
	var value=JSON.stringify(recherches);
	localStorage.setItem(name,value);

}


function selectionner_recherche(elt){
	//déclenché quand clic sur le label de la zone 1 - en haut à gauche
	//Affichage du mot clé  dans la zone de saisie
	// var x= $(elt).html(); //récupère le contenu du label
  // recherche_courante=x;
	// $("#zone_saisie").val(x);
	//
	// ou en javascript:
	var c=document.getElementById("zone_saisie");
  c.value=elt.innerHTML;
	recherche_courante=elt.innerHTML;

	//Affichage des nouvelles sauvegardées correspondantes
	// $("#resultats").text(" ");
	// var myJsonString=$.cookie(recherche_courante);
	// if (myJsonString != null) {
	// 	var tabJson = JSON.parse(myJsonString);
	// 	//recherche_courante_news=[];
	// 	recherche_courante_news = tabJson; //mise à jour variable globale
	// 	for (var i = 0; i < tabJson.length; i++) {
	// 		var titre=decodeEntities(tabJson[i].titre); //decodeentities pas obligatoire?
	// 		var url=tabJson[i].url;
	// 		var date=tabJson[i].date;
	// 		var s='<p class="titre_result"><a class="titre_news" href="'+url+'" target="_blank">'+titre+'</a>';
	// 		s=s+'<span class="date_news">'+date+'</span>';
	// 		s=s+'<span class="action_news" onclick="supprime_news(this)"><img src="disk15.jpg" /></span></p>';
	// 		$("#resultats").append(s);
	// 	}
	// }
}


function init() {
	document.getElementById("zone_saisie").value="";
	// ou en Jquery $("#zone_saisie").val(""); //clear de la zone de saisie

	//cookies
	//var myJsonString=$.cookie('recherches');

	var myJsonString=localStorage.getItem("recherches");
	if (myJsonString != null) {
		recherches = JSON.parse(myJsonString);
		for (var j = 0; j < recherches.length; j++) {
			var s=recherches[j];
			var shtml='<p class="titre-recherche"><label onclick="selectionner_recherche(this)" >'+s+'</label><img src="img/croix30.jpg" class="icone-croix" onclick="supprimer_recherche(this)"/> </p>';
			$("#recherches-stockees").append(shtml);
			// ou bien
			// var sInit=document.getElementById("recherches-stockees").innerHTML;
			// shtml=sInit+shtml;
			// document.getElementById("recherches-stockees").innerHTML=shtml;
		}
	}
}


function rechercher_nouvelles() {
	$("#resultats").text(""); //clear de la zone de résultats
	$("#wait").css("display", "block");
	var s=$("#zone_saisie").val();
	recherche_courante=s;
	//alert ("voici ce qu'on envoie au serveur: "+s)
	$.get('https://carl-vincent.fr/search-internships.php?data='+s,maj_resultats);
	//ou s='data='+s; $.get('search.php',s,maj_resultats);
}


function maj_resultats(sJson) {
	$("#wait").css("display", "none");
	//sJson est une chaîne représentant un tableau d'objets au format JSON,
	//chaque objet correspondant à un résultat avec un titre, une date, une url et un score (?).
	// on parse la chaine sJson pour en faire un tableau tabJson
	//mais 03-2020 on n'a plus besoin de faire le parse!!!!
	var tabJson = sJson;
	for (var i = 0; i < tabJson.length; i++) {
		var titre=tabJson[i].titre;
		var url=tabJson[i].url;
		var date=tabJson[i].date;
		var s='<p class="titre_result"><a class="titre_news" href="'+url+'" target="_blank">'+titre+'</a>';
		s=s+'<span class="date_news">'+date+'</span>';
		s=s+'<span class="action_news" onclick="sauve_news(this)"><img src="img/horloge15.jpg" /></span></p>';
		$("#resultats").append(s);
	}
}


function sauver_nouvelle(elt) {
	//TODO ...
}


function supprimer_nouvelle(elt) {
	//TODO ...
}
