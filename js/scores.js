import {$} from "../library/jquery-4.0.0.slim.module.min.js";

function loadRanking(){
	let ranking = [];
	try{
		ranking = JSON.parse(localStorage.memoryRanking || "[]");
	}
	catch(error){
		console.warn("No s'ha pogut carregar el rànquing.");
	}

	const list = $("#scores-list");
	list.empty();

	if (!ranking.length){
		list.append("<li>Encara no hi ha puntuacions guardades.</li>");
		return;
	}

	ranking.slice(0, 10).forEach((entry) => {
		const alias = entry.alias || "Jugador";
		const score = entry.score || 0;
		const level = entry.level || 1;
		const date = entry.date || "";
		list.append(`<li><strong>${alias}</strong> - ${score} punts · Nivell ${level}<br><span class="muted">${date}</span></li>`);
	});
}

addEventListener("load", function(){
	loadRanking();

	document.getElementById("clear-scores").addEventListener("click", function(){
		if (confirm("Vols esborrar totes les puntuacions?")){
			localStorage.removeItem("memoryRanking");
			loadRanking();
		}
	});

	document.getElementById("back").addEventListener("click", function(){
		window.location.assign("../");
	});
});
