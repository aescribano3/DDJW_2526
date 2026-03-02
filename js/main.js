addEventListener('load', function() {
    document.getElementById('play').addEventListener('click', 
    function(){

        let player = prompt("Introdueix el nom del jugador","Jugador 1");
		if (player === null || player.trim() === "") {
			console.warn("Nom no valid");
		} else {
			console.log("Nom del jugador: " + player);
		}

        window.location.assign("./html/game.html");

    });

    document.getElementById('options').addEventListener('click', 
    function(){
        console.error("Opció no implementada");
    });

    document.getElementById('saves').addEventListener('click', 
    function(){
        console.error("Opció no implementada");
    });

    document.getElementById('exit').addEventListener('click', 
    function(){
        console.warn("No es pot sortir!");
    });
});