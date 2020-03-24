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

	//puis
	//Affichage des nouvelles sauvegardées correspondantes
	$("#resultats").text("");
	var name=recherche_courante;
	var myJsonString=localStorage.getItem(name);
	if (myJsonString != null) {
		//alert(name);
		var tabJson = JSON.parse(myJsonString);
		recherche_courante_news=[];
		recherche_courante_news = tabJson; //mise à jour variable globale
		for (var i = 0; i < tabJson.length; i++) {
			var titre=decodeHtmlEntities(tabJson[i].titre); //decodeentities pas obligatoire?
			var url=tabJson[i].url;
			var date=tabJson[i].date;
			var s='<p class="titre_result">';
			s=s+'<a class="titre_news" href="'+url+'" target="_blank">'+titre+'</a>';
			s=s+'<span class="date_news">'+date+'</span>';
			s=s+'<span class="action_news" onclick="supprime_news(this)"><img src="img/disk15.jpg" /></span>';
			s=s+'</p>';
			$("#resultats").append(s);
		}
	}else{
		alert("riend'enregistré pour "+name);
	}
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
	//mais 03-2020 on n'a plus besoin de faire le parse car Carl a
	//mis un header dans le search:
	//header('Access-Control-Allow-Origin: *');
	//header('Content-Type: application/json');!!!!
	var tabJson = sJson;
	for (var i = 0; i < tabJson.length; i++) {
		var titre=tabJson[i].titre;
		var url=tabJson[i].url;
		var date=tabJson[i].date;
		date=formatDate(date); //fonction de util.js
		var s='<p class="titre_result">';
		s=s+'<a class="titre_news" href="'+url+'" target="_blank">'+titre+'</a>';
		s=s+'<span class="date_news">'+date+'</span>';
		s=s+'<span class="action_news" onclick="sauver_nouvelle(this)"><img src="img/horloge15.jpg" /></span>';
		s=s+'</p>';
		$("#resultats").append(s);
	}
}

function sauver_nouvelle(e) {
	$(e).html('<img src="img/disk15.jpg"/>');
	//ou en javascript e.innerHTML='<img src="img/disk15.jpg"/>';
	$(e).attr("onclick","supprimer_nouvelle(this)");
	//ou en javascript e.setAttribute("onclick","supprime_news(this)");

	var elt=e.parentNode;
	var x = elt.getElementsByTagName("a")[0].getAttribute("href"); //l'url
	var y = elt.getElementsByTagName("a")[0].textContent; //le titre
	var z = elt.getElementsByTagName("span")[0].textContent; //la date

	var o= new Object();
	o.url=x;
	o.titre=y;
	o.date=z;

	//alert(JSON.stringify(o));
	var i=indexOfResultat(recherche_courante_news,o); //indexOfResultat de util.js
	// alert("i: "+i);
	if (i==-1) {
		recherche_courante_news.push(o);
	}else {
		alert("déjà enregistré");
	}
	var myJsonString = JSON.stringify(recherche_courante_news);
	// on sauve
	var name=recherche_courante;
	var value=JSON.stringify(recherche_courante_news);
	localStorage.setItem(name,value);
	//$.cookie(recherche_courante, myJsonString, { expires: 1000 });

}

function supprimer_nouvelle(e) {
	$(e).html('<img src="img/horloge15.jpg"/>');
	//ou en javascript e.innerHTML='<img src="disk15.jpg"/>';
	$(e).attr("onclick","sauver_nouvelle(this)");
	//ou en javascript e.setAttribute("onclick","supprime_news(this)");

	var elt=e.parentNode;
	var x = elt.getElementsByTagName("a")[0].getAttribute("href");//url
	var y = elt.getElementsByTagName("a")[0].textContent;//titre
	var z = elt.getElementsByTagName("span")[0].textContent;//date

	var o= new Object();
	o.url=x;
	o.titre=y;
	o.date=z;

	//alert(JSON.stringify(o));
	var i =indexOfResultat(recherche_courante_news,o); //indexOfResultat de util.js
	//alert("indice de element à supprimer:"+i);

	var name=recherche_courante;
	recherche_courante_news.splice(i,1); //suppression de 1 seul elt à l'indice i
	var value = JSON.stringify(recherche_courante_news);
	localStorage.setItem(name,value);
}
