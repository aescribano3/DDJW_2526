import {$} from "../library/jquery-4.0.0.slim.module.min.js";

function loadRanking(){
	let ranking = [];
	if (localStorage.ranking){
		try{
			ranking = JSON.parse(localStorage.ranking);
		}
		catch(error){
			console.warn("No s'ha pogut carregar el rànquing.");
		}
	}

	const list = $("#scores-list");
	list.empty();

	if (!ranking.length){
		list.append("<li>Encara no hi ha puntuacions guardades.</li>");
		return;
	}

	ranking.slice(0, 10).forEach((entry, index) => {
		const alias = entry.alias || "Jugador";
		const score = entry.score || 0;
		list.append(`<li><strong>${index + 1}. ${alias}</strong> - ${score} punts</li>`);
	});
}

addEventListener("load", function(){
	loadRanking();
	document.getElementById("back").addEventListener("click", function(){
		window.location.assign("../");
	});
});
