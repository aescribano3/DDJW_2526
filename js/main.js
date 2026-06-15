function getElement(id){
	return document.getElementById(id);
}

function openModal(){
	const modal = getElement("choseMode");
	if (modal) modal.style.display = "block";
}

function closeModal(){
	const modal = getElement("choseMode");
	if (modal) modal.style.display = "none";
}

function saveAlias(){
	const aliasInput = getElement("alias");
	const alias = aliasInput ? aliasInput.value.trim() : "";
	localStorage.playerAlias = alias || "Jugador";
}

function goToOptions(mode){
	saveAlias();
	localStorage.gameMode = mode;
	closeModal();
	window.location.href = "./html/options.html";
}

window.addEventListener("DOMContentLoaded", function(){
	getElement("play")?.addEventListener("click", openModal);
	getElement("mode1")?.addEventListener("click", function(){ goToOptions("mode1"); });
	getElement("mode2")?.addEventListener("click", function(){ goToOptions("mode2"); });

	getElement("scores")?.addEventListener("click", function(){
		window.location.href = "./html/scores.html";
	});

	getElement("load")?.addEventListener("click", function(){
		window.location.href = "./html/load.html";
	});
	
	getElement("close-modal")?.addEventListener("click", closeModal);
	const closeButton = document.querySelector(".close");
	if (closeButton) closeButton.addEventListener("click", closeModal);

	window.addEventListener("click", function(event){
		const modal = getElement("choseMode");
		if (modal && event.target === modal) closeModal();
	});
});
