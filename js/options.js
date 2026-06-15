import {$} from "../library/jquery-4.0.0.slim.module.min.js";

const defaultMode1Options = {
	mode: 1,
	numCards: 12,
	difficulty: "normal",
	group: 2
};

const defaultMode2Options = {
	mode: 2,
	startLevel: 1
};

const selectedMode = localStorage.gameMode === "mode2" ? 2 : 1;
const numCards = $('#numCards');
const difficulty = $('#difficulty');
const group = $('#group');
const startLevel = $('#startLevel');
const warning = $('#warning');
const mode1Options = $('#mode1-options');
const mode2Options = $('#mode2-options');
const title = $('#options-title');

let options = selectedMode === 2 ? {...defaultMode2Options} : {...defaultMode1Options};

if (selectedMode === 2 && localStorage.mode2Options){
	try{
		options = {...options, ...JSON.parse(localStorage.mode2Options), mode: 2};
	}
	catch(error){
		console.warn("No s'han pogut carregar les opcions guardades del mode 2.");
	}
}
else if (selectedMode === 1 && localStorage.options){
	try{
		const savedOptions = JSON.parse(localStorage.options);
		options = {...options, ...savedOptions, mode: 1};
	}
	catch(error){
		console.warn("No s'han pogut carregar les opcions guardades del mode 1.");
	}
}

function normalizeMode1Options(){
	const originalNumCards = Number(options.numCards);
	options.numCards = originalNumCards;
	options.group = Number(options.group);

	const remainder = options.numCards % options.group;
	if (remainder !== 0){
		options.numCards -= remainder;
	}

	const maxCards = 6 * options.group;
	if (options.numCards > maxCards){
		options.numCards = maxCards;
	}

	if (options.numCards < options.group){
		options.numCards = options.group;
	}

	return originalNumCards !== options.numCards;
}

function updateForm(){
	if (selectedMode === 2){
		title.text("Opcions Mode 2");
		mode1Options.hide();
		mode2Options.show();
		startLevel.val(String(options.startLevel));
		warning.text("En el mode 2 la dificultat puja automàticament a cada nivell.");
		return;
	}

	title.text("Opcions Mode 1");
	mode1Options.show();
	mode2Options.hide();
	const adjusted = normalizeMode1Options();
	numCards.val(String(options.numCards));
	difficulty.val(options.difficulty);
	group.val(String(options.group));

	if (adjusted){
		warning.text(`S'ha ajustat a ${options.numCards} cartes perquè la quantitat sigui compatible amb grups de ${options.group}.`);
	}
	else{
		warning.text("");
	}
}

numCards.on('change', function(){
	options.numCards = Number(numCards.val());
	updateForm();
});

difficulty.on('change', function(){
	options.difficulty = difficulty.val();
});

group.on('change', function(){
	options.group = Number(group.val());
	updateForm();
});

startLevel.on('change', function(){
	options.startLevel = Number(startLevel.val()) || 1;
});

$('#default').on('click', function(){
	options = selectedMode === 2 ? {...defaultMode2Options} : {...defaultMode1Options};
	updateForm();
});

$('#apply').on('click', function(){
	sessionStorage.removeItem('load');
	sessionStorage.removeItem('mode2Progress');

	if (selectedMode === 2){
		options.startLevel = Number(options.startLevel) || 1;
		localStorage.mode2Options = JSON.stringify(options);
		localStorage.gameMode = "mode2";
	}
	else{
		normalizeMode1Options();
		localStorage.options = JSON.stringify(options);
		localStorage.gameMode = "mode1";
	}
	window.location.assign("../html/game.html");
});

updateForm();
