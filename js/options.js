import {$} from "../library/jquery-4.0.0.slim.module.min.js";

const defaultMode1Options = {
	mode: 1,
	numCards: 12,
	difficulty: "normal",
	group: 2
};

const defaultMode2Options = {
	mode: 2,
	startLevel: 1,
	group: 2,
	difficulty: "normal"
};

const mode = localStorage.gameMode === "mode2" ? 2 : 1;
const numCards = $('#numCards');
const difficulty = $('#difficulty');
const group = $('#group');
const startLevel = $('#startLevel');
const warning = $('#warning');

let options = mode === 2 ? {...defaultMode2Options} : {...defaultMode1Options};

if (localStorage.options){
	try{
		const savedOptions = JSON.parse(localStorage.options);
		options = {...options, ...savedOptions, mode};
	}
	catch(error){
		console.warn("No s'han pogut carregar les opcions guardades.");
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

function normalizeMode2Options(){
	options.startLevel = Math.max(1, Number(options.startLevel) || 1);
	options.group = Math.max(2, Number(options.group) || 2);
	options.difficulty = "normal";
}

function updateForm(){
	$('#options-title').text(mode === 2 ? "Opcions Mode 2" : "Opcions Mode 1");
	$('#mode1-options').css('display', mode === 1 ? 'block' : 'none');
	$('#mode2-options').css('display', mode === 2 ? 'block' : 'none');

	if (mode === 1){
		const adjusted = normalizeMode1Options();
		numCards.val(String(options.numCards));
		difficulty.val(options.difficulty);
		group.val(String(options.group));
		warning.text(adjusted ? `S'ha ajustat a ${options.numCards} cartes perquè la quantitat sigui compatible amb grups de ${options.group}.` : "");
	}
	else{
		normalizeMode2Options();
		startLevel.val(String(options.startLevel));
		group.val(String(options.group));
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
	options.startLevel = Number(startLevel.val());
	updateForm();
});

$('#default').on('click', function(){
	options = mode === 2 ? {...defaultMode2Options} : {...defaultMode1Options};
	updateForm();
});

$('#apply').on('click', function(){
	if (mode === 1) normalizeMode1Options();
	else normalizeMode2Options();

	localStorage.options = JSON.stringify(options);
	sessionStorage.removeItem('load');
	sessionStorage.removeItem('nextMode2Level');
	window.location.assign("../html/game.html");
});

$('#back').on('click', function(){
	window.location.assign("../");
});

updateForm();
