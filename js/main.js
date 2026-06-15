import {$} from "../library/jquery-4.0.0.slim.module.min.js";

const modal = $("#choseMode");
const span = $(".close");

function saveAlias(){
	const aliasInput = document.getElementById('alias');
	const alias = aliasInput ? aliasInput.value.trim() : "";
	localStorage.playerAlias = alias || "Jugador";
}

addEventListener('load', function() {
	document.getElementById('play')?.addEventListener('click', function () {
		modal.css("display", "block");
	});

	document.getElementById('mode1')?.addEventListener('click', function () {
		saveAlias();
		localStorage.gameMode = "mode1";
		modal.css("display", "none");
		window.location.assign("./html/options.html");
	});

	document.getElementById('mode2')?.addEventListener('click', function () {
		saveAlias();
		localStorage.gameMode = "mode2";
		modal.css("display", "none");
		window.location.assign("./html/options.html");
	});

	document.getElementById('scores')?.addEventListener('click', function () {
		window.location.assign("./html/scores.html");
	});

	document.getElementById('load')?.addEventListener('click', function () {
		window.location.assign("./html/load.html");
	});

	document.getElementById('exit')?.addEventListener('click', function () {
		window.close();
	});
});

span.click(function(){
	modal.css("display", "none");
});
