import {$} from "../library/jquery-4.0.0.slim.module.min.js";

const defaultOptions = {
	mode: 1,
	numCards: 12,
	difficulty: "normal",
	group: 2
};

const numCards = $('#numCards');
const difficulty = $('#difficulty');
const group = $('#group');
const warning = $('#warning');

let options = {...defaultOptions};

if (localStorage.options){
	try{
		const savedOptions = JSON.parse(localStorage.options);
		options = {...options, ...savedOptions, mode: 1};
	}
	catch(error){
		console.warn("No s'han pogut carregar les opcions guardades.");
	}
}

function normalizeOptions(){
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
	const adjusted = normalizeOptions();
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

$('#default').on('click', function(){
	options = {...defaultOptions};
	updateForm();
});

$('#apply').on('click', function(){
	normalizeOptions();
	localStorage.options = JSON.stringify(options);
	sessionStorage.removeItem('load');
	window.location.assign("../html/game.html");
});

updateForm();
