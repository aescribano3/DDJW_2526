import {$} from "../library/jquery-4.0.0.slim.module.min.js";
import {clickCard, gameItems, selectCards, startGame, initCard, saveGame, drawCard, getGameInfo} from "./memory.js";

const gameCanvas = $('#game');
const canvas = gameCanvas[0].getContext('2d');
const cards = [];
const e_click = {click: false, x: -1, y: -1};
let key = null;
let idxSel = -1;

const cardWidth = 86;
const cardHeight = 116;
const margin = 18;
const topMargin = 26;

if (canvas){
	start();
	update();
}

function start(){
	selectCards();
	const info = getGameInfo();
	$('#game-title').text(info.mode === 2 ? 'Mode 2' : 'Mode 1');
	$('#info-mode').text(info.mode === 2 ? 'Mode 2' : 'Mode 1');
	const columns = Math.min(6, Math.ceil(Math.sqrt(gameItems.length)));
	const startX = 30;
	const startY = topMargin;

	gameItems.forEach((cardType, indx) => {
		initCard(val => cards[indx].texture = val);
		const col = indx % columns;
		const row = Math.floor(indx / columns);
		cards[indx] = {
			texture: cardType,
			position: {
				xMin: startX + col * (cardWidth + margin),
				xMax: startX + col * (cardWidth + margin) + cardWidth,
				yMin: startY + row * (cardHeight + margin),
				yMax: startY + row * (cardHeight + margin) + cardHeight
			},
			onClick: function(x, y){
				return x >= this.position.xMin && x <= this.position.xMax &&
					y >= this.position.yMin && y <= this.position.yMax;
			}
		};
	});

	gameCanvas.on('click', function(e){
		const rect = this.getBoundingClientRect();
		e_click.click = true;
		e_click.x = e.clientX - rect.left;
		e_click.y = e.clientY - rect.top;
	});
	$(document).keydown(e => key = e.key);
	$('#save').on('click', () => saveGame());
	$('#menu').on('click', () => window.location.assign('../'));
	startGame();
}

function update(){
	checkInput();
	draw();
	updateHud();
	requestAnimationFrame(update);
}

function draw(){
	canvas.clearRect(0, 0, gameCanvas[0].width, gameCanvas[0].height);
	canvas.fillStyle = "#f3f4f6";
	canvas.fillRect(0, 0, gameCanvas[0].width, gameCanvas[0].height);

	cards.forEach((card, indx) => {
		drawCard(
			canvas,
			card.texture,
			card.position.xMin,
			card.position.yMin,
			cardWidth,
			cardHeight,
			idxSel === indx
		);
	});
}

function updateHud(){
	const info = getGameInfo();
	$('#info-score').text(`Punts nivell: ${info.score}`);
	$('#info-total').text(`Total: ${info.totalScore}`);
	$('#info-groups').text(`Grups pendents: ${info.groupsLeft}`);
	$('#info-difficulty').text(info.mode === 2 ? `Dificultat: ${info.difficulty}` : `Dificultat: ${info.difficulty}`);
	$('#info-level').text(`Nivell: ${info.level}`);
	$('#info-level').toggle(info.mode === 2);
	$('#info-total').toggle(info.mode === 2);
}

function checkInput(){
	if (e_click.click){
		cards.some((card, indx) => {
			let click = card.onClick(e_click.x, e_click.y);
			if (click) clickCard(indx);
			return click;
		});
	}

	if (key){
		switch(key){
			case "Escape":
				saveGame();
				break;
			case "ArrowRight":
				idxSel = (idxSel + 1) % cards.length;
				break;
			case "ArrowLeft":
				idxSel = (idxSel - 1 + cards.length) % cards.length;
				break;
			case "ArrowDown":
				idxSel = (idxSel + Math.min(6, Math.ceil(Math.sqrt(cards.length)))) % cards.length;
				break;
			case "ArrowUp":
				idxSel = (idxSel - Math.min(6, Math.ceil(Math.sqrt(cards.length))) + cards.length) % cards.length;
				break;
			case "Enter":
				if (idxSel >= 0) clickCard(idxSel);
				break;
			default:
				console.warn("Tecla " + key + " no reconeguda.");
		}
	}

	e_click.click = false;
	key = null;
}
