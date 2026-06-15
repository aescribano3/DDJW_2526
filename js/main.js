import {$} from "../library/jquery-4.0.0.slim.module.min.js";

var modal = $("#choseMode");
var span = $(".close");

addEventListener('load', function() {
	document.getElementById('play').addEventListener('click', function () {
		modal.css("display", "block");
	});

	document.getElementById('mode1').addEventListener('click', function () {
		localStorage.gameMode = "mode1";
		modal.css("display", "none");
		window.location.assign("./html/options.html");
	});
	document.getElementById('mode2').addEventListener('click', function () {
		localStorage.gameMode = "mode2";
		modal.css("display", "none");
		window.location.assign("./html/options.html");
	});
	document.getElementById('scores').addEventListener('click', function () {
		window.location.assign("./html/scores.html");
	});

	document.getElementById('options').addEventListener('click', function () {
		window.location.assign("./html/options.html");
	});

	document.getElementById('load').addEventListener('click', function () {
		window.location.assign("./html/load.html");
	});

    /*document.getElementById('saves').addEventListener('click', 
    function(){
        let to_load = localStorage.save;
        fetch('../php/load.php', {
            method: "POST",
            body: JSON.stringify({}),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(json => to_load = (!json.error)?JSON.stringify(json.save): localStorage.save)
        .catch (err => {
            console.error(err);
            console.warn("La partida s'intentarà carregar de local");
        });

        if (!to_load) {
            alert("No hi ha cap partida a carregar");
            return;
        }
        sessionStorage.load = to_load;
        window.location.assign("./html/game.html");
    });*/
});

span.click(function(){
    modal.css("display", "none");
});

