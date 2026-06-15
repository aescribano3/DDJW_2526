import {$} from "../library/jquery-4.0.0.slim.module.min.js";

function getSaves(){
	try{
		return JSON.parse(localStorage.memorySaves || "[]");
	}
	catch(error){
		return [];
	}
}

function setSaves(saves){
	localStorage.memorySaves = JSON.stringify(saves);
}

function showSaveList(){
	const container = $("#save-list");
	container.empty();

	const saves = getSaves();
	if (!saves.length){
		container.append("<p>No hi ha cap partida guardada.</p>");
		return;
	}

	saves.forEach(save => {
		const mode = save.mode === 2 ? "Mode 2" : "Mode 1";
		const level = save.mode === 2 ? ` · Nivell ${save.level || 1}` : "";
		const score = save.score ?? 0;
		const alias = save.alias || "Jugador";
		const date = save.date || "Sense data";

		container.append(`
			<div class="save-card" data-id="${save.id}">
				<strong>${mode}${level}</strong>
				<p>${alias} · ${score} punts</p>
				<p class="muted">${date}</p>
				<div class="actions compact-actions">
					<button class="load-save" data-id="${save.id}">Carregar</button>
					<button class="delete-save" data-id="${save.id}">Esborrar</button>
				</div>
			</div>
		`);
	});
}

addEventListener("load", function(){
	showSaveList();

	document.getElementById("save-list").addEventListener("click", function(event){
		const id = event.target.dataset.id;
		if (!id) return;

		let saves = getSaves();
		const save = saves.find(item => item.id === id);

		if (event.target.classList.contains("load-save") && save){
			sessionStorage.load = JSON.stringify(save.state);
			localStorage.gameMode = save.mode === 2 ? "mode2" : "mode1";
			window.location.assign("../html/game.html");
		}

		if (event.target.classList.contains("delete-save")){
			saves = saves.filter(item => item.id !== id);
			setSaves(saves);
			showSaveList();
		}
	});

	document.getElementById("back").addEventListener("click", function(){
		window.location.assign("../");
	});
});
