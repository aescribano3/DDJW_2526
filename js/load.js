import {$} from "../library/jquery-4.0.0.slim.module.min.js";

function showSaveList(){
	const container = $("#save-list");
	container.empty();

	if (!localStorage.save){
		container.append("<p>No hi ha cap partida guardada.</p>");
		return;
	}

	let saveInfo = "Partida guardada";
	try{
		const save = JSON.parse(localStorage.save);
		const mode = save.mode === 2 ? "Mode 2" : "Mode 1";
		const level = save.mode === 2 ? ` - Nivell ${save.level || 1}` : "";
		saveInfo = `${mode}${level}`;
	}
	catch(error){
		console.warn("No s'ha pogut llegir la partida guardada.");
	}

	container.append(`
		<div class="save-card">
			<strong>${saveInfo}</strong>
			<p>La càrrega real de partides es farà a la issue de guardar i carregar.</p>
		</div>
	`);
}

addEventListener("load", function(){
	showSaveList();
	document.getElementById("back").addEventListener("click", function(){
		window.location.assign("../");
	});
});
