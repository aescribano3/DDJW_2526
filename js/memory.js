const resources = [
	"circle",
	"square",
	"triangle",
	"diamond",
	"star",
	"cross"
];
const back = "back";

export function drawCard(ctx, type, x, y, width, height, selected = false){
	ctx.save();
	ctx.lineWidth = selected ? 5 : 2;
	ctx.fillStyle = type === back ? "#111827" : "#ffffff";
	ctx.strokeStyle = selected ? "#f1c40f" : "#111827";
	ctx.fillRect(x, y, width, height);
	ctx.strokeRect(x, y, width, height);

	if (type === back){
		ctx.fillStyle = "#e5e7eb";
		ctx.font = "bold 34px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("?", x + width / 2, y + height / 2);
		ctx.restore();
		return;
	}

	ctx.fillStyle = "#2c3e50";
	const cx = x + width / 2;
	const cy = y + height / 2;
	const size = Math.min(width, height);

	switch(type){
		case "circle":
			ctx.beginPath();
			ctx.arc(cx, cy, size / 4, 0, Math.PI * 2);
			ctx.fill();
			break;
		case "square":
			ctx.fillRect(cx - size / 4, cy - size / 4, size / 2, size / 2);
			break;
		case "triangle":
			ctx.beginPath();
			ctx.moveTo(cx, cy - size / 3);
			ctx.lineTo(cx - size / 3, cy + size / 3);
			ctx.lineTo(cx + size / 3, cy + size / 3);
			ctx.closePath();
			ctx.fill();
			break;
		case "diamond":
			ctx.beginPath();
			ctx.moveTo(cx, cy - size / 3);
			ctx.lineTo(cx - size / 3, cy);
			ctx.lineTo(cx, cy + size / 3);
			ctx.lineTo(cx + size / 3, cy);
			ctx.closePath();
			ctx.fill();
			break;
		case "star":
			ctx.beginPath();
			for (let i = 0; i < 10; i++){
				const radius = i % 2 === 0 ? size / 3 : size / 7;
				const angle = i * Math.PI / 5 - Math.PI / 2;
				const px = cx + Math.cos(angle) * radius;
				const py = cy + Math.sin(angle) * radius;
				if (i === 0) ctx.moveTo(px, py);
				else ctx.lineTo(px, py);
			}
			ctx.closePath();
			ctx.fill();
			break;
		case "cross":
			ctx.fillRect(cx - size / 10, cy - size / 3, size / 5, 2 * size / 3);
			ctx.fillRect(cx - size / 3, cy - size / 10, 2 * size / 3, size / 5);
			break;
	}
	ctx.restore();
}

const StateCard = Object.freeze({
	DISABLE: 0,
	ENABLE: 1,
	DONE: 2
});

const difficultyConfig = {
	easy: {score: 300, penalty: 15, initialTime: 1800, failTime: 900, label: "Fàcil"},
	normal: {score: 220, penalty: 25, initialTime: 1300, failTime: 700, label: "Normal"},
	hard: {score: 160, penalty: 40, initialTime: 800, failTime: 500, label: "Difícil"}
};

function normalizeCardNumber(numCards, group){
	let normalized = Number(numCards) || group;
	const maxCards = resources.length * group;
	if (normalized > maxCards) normalized = maxCards;
	if (normalized < group) normalized = group;
	const remainder = normalized % group;
	if (remainder !== 0) normalized -= remainder;
	if (normalized < group) normalized = group;
	return normalized;
}

function getMode2LevelConfig(level){
	const currentLevel = Math.max(1, Number(level) || 1);
	const group = 2 + Math.floor((currentLevel - 1) / 3);
	const rawCards = 6 + (currentLevel - 1) * 2;
	const numCards = normalizeCardNumber(Math.min(rawCards, 36), group);

	return {
		level: currentLevel,
		group: group,
		numCards: numCards,
		difficulty: `Nivell ${currentLevel}`,
		score: 240 + currentLevel * 35,
		penalty: 15 + currentLevel * 8,
		initialTime: Math.max(450, 1700 - currentLevel * 90),
		failTime: Math.max(300, 850 - currentLevel * 35)
	};
}

var game = {
	items: [],
	states: [],
	setValue: null,
	ready: 0,
	selected: [],
	score: 220,
	totalScore: 0,
	groupsLeft: 0,
	group: 2,
	mode: 1,
	level: 1,
	difficulty: "normal",
	numCards: 12,
	penalty: 25,
	initialTime: 1300,
	failTime: 700,
	locked: false,
	goBack: function(idx){
		this.setValue && this.setValue[idx](back);
		this.states[idx] = StateCard.ENABLE;
	},
	goFront: function(idx){
		this.setValue && this.setValue[idx](this.items[idx]);
		this.states[idx] = StateCard.DISABLE;
	},
	loadOptions: function(){
		const selectedMode = localStorage.gameMode === "mode2" ? 2 : 1;
		if (selectedMode === 2){
			let mode2Options = {mode: 2, startLevel: 1};
			if (localStorage.mode2Options){
				try{
					mode2Options = {...mode2Options, ...JSON.parse(localStorage.mode2Options)};
				}
				catch(error){
					console.warn("No s'han pogut carregar les opcions del mode 2.");
				}
			}
			let progress = {level: Number(mode2Options.startLevel) || 1, totalScore: 0};
			if (sessionStorage.mode2Progress){
				try{
					progress = {...progress, ...JSON.parse(sessionStorage.mode2Progress)};
				}
				catch(error){
					console.warn("No s'ha pogut carregar el progrés del mode 2.");
				}
			}
			this.setMode2(progress.level, progress.totalScore);
			return;
		}

		let options = {mode: 1, numCards: 12, group: 2, difficulty: "normal"};
		if (localStorage.options){
			try{
				options = {...options, ...JSON.parse(localStorage.options)};
			}
			catch(error){
				console.warn("No s'han pogut carregar les opcions del mode 1.");
			}
		}
		this.setMode1(options);
	},
	setMode1: function(options){
		this.mode = 1;
		this.level = 1;
		this.totalScore = 0;
		this.numCards = Number(options.numCards) || 12;
		this.group = Number(options.group) || 2;
		this.difficulty = options.difficulty || "normal";

		if (!difficultyConfig[this.difficulty]) this.difficulty = "normal";
		this.numCards = normalizeCardNumber(this.numCards, this.group);

		const config = difficultyConfig[this.difficulty];
		this.score = config.score;
		this.penalty = config.penalty;
		this.initialTime = config.initialTime;
		this.failTime = config.failTime;
		this.groupsLeft = this.numCards / this.group;
	},
	setMode2: function(level, totalScore = 0){
		const config = getMode2LevelConfig(level);
		this.mode = 2;
		this.level = config.level;
		this.totalScore = Number(totalScore) || 0;
		this.group = config.group;
		this.numCards = config.numCards;
		this.difficulty = config.difficulty;
		this.score = config.score;
		this.penalty = config.penalty;
		this.initialTime = config.initialTime;
		this.failTime = config.failTime;
		this.groupsLeft = this.numCards / this.group;
	},
	select: function(){
		this.ready = 0;
		this.selected = [];
		this.locked = false;

		if (sessionStorage.load){
			let toLoad = JSON.parse(sessionStorage.load);
			this.items = toLoad.items;
			this.states = toLoad.states;
			this.selected = toLoad.selected || [];
			this.score = toLoad.score;
			this.totalScore = toLoad.totalScore || 0;
			this.groupsLeft = toLoad.groupsLeft ?? toLoad.pairs ?? 0;
			this.group = toLoad.group;
			this.difficulty = toLoad.difficulty || "normal";
			this.mode = toLoad.mode || 1;
			this.level = toLoad.level || 1;
			this.numCards = this.items.length;

			if (this.mode === 2){
				const config = getMode2LevelConfig(this.level);
				this.penalty = config.penalty;
				this.initialTime = config.initialTime;
				this.failTime = config.failTime;
			}
			else{
				const config = difficultyConfig[this.difficulty] || difficultyConfig.normal;
				this.penalty = config.penalty;
				this.initialTime = config.initialTime;
				this.failTime = config.failTime;
			}
		}
		else{
			this.loadOptions();
			const neededGroups = this.numCards / this.group;
			this.items = resources.slice(0, neededGroups);
			let baseItems = this.items.slice();
			for (let i = 1; i < this.group; i++){
				this.items = this.items.concat(baseItems);
			}
			shuffle(this.items);
			this.states = new Array(this.items.length).fill(StateCard.ENABLE);
		}
	},
	start: function(){
		this.items.forEach((_, indx)=>{
			if (this.states[indx] === StateCard.DISABLE || this.states[indx] === StateCard.DONE){
				this.ready++;
			}
			else{
				setTimeout(()=>{
					this.ready++;
					this.goBack(indx);
				}, this.initialTime + 60 * indx);
			}
		});
	},
	click: function(indx){
		if (this.locked || this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length || this.selected.length >= this.group) return;

		this.goFront(indx);
		this.selected.push(indx);
		let first = this.items[this.selected[0]];

		if (this.selected.some(i => this.items[i] !== first)){
			let cardsToHide = [...this.selected];
			this.selected = [];
			this.locked = true;
			this.score -= this.penalty;

			setTimeout(() => {
				cardsToHide.forEach(i => this.goBack(i));
				this.locked = false;
				if (this.score <= 0){
					alert(this.mode === 2 ? `Has perdut al nivell ${this.level}. Puntuació total: ${this.totalScore}` : "Has perdut");
					sessionStorage.removeItem("mode2Progress");
					window.location.assign("../");
				}
			}, this.failTime);
			return;
		}

		if (this.selected.length === this.group){
			this.selected.forEach(i => this.states[i] = StateCard.DONE);
			this.groupsLeft--;
			this.selected = [];
			if (this.groupsLeft <= 0){
				if (this.mode === 2){
					this.totalScore += Math.max(0, this.score) + this.level * 100;
					sessionStorage.mode2Progress = JSON.stringify({level: this.level + 1, totalScore: this.totalScore});
					alert(`Nivell ${this.level} superat! Puntuació total: ${this.totalScore}`);
					window.location.reload();
				}
				else{
					alert(`Has guanyat amb ${this.score} punts!`);
					window.location.assign("../");
				}
			}
		}
	},
	save: function(){
		let to_save = JSON.stringify({
			items: this.items,
			states: this.states,
			selected: this.selected,
			score: this.score,
			totalScore: this.totalScore,
			groupsLeft: this.groupsLeft,
			group: this.group,
			difficulty: this.difficulty,
			mode: this.mode,
			level: this.level
		});
		localStorage.save = to_save;
		console.warn("La partida s'ha guardat en local.");
		window.location.assign("../");
	},
	getInfo: function(){
		return {
			score: this.score,
			totalScore: this.totalScore,
			groupsLeft: this.groupsLeft,
			group: this.group,
			difficulty: difficultyConfig[this.difficulty]?.label || this.difficulty,
			numCards: this.numCards,
			mode: this.mode,
			level: this.level,
			penalty: this.penalty,
			initialTime: this.initialTime,
			failTime: this.failTime
		};
	}
};

function shuffle(arr){
	arr.sort(function(){ return Math.random() - 0.5; });
}

export var gameItems;
export function selectCards(){
	game.select();
	gameItems = game.items;
}
export function clickCard(indx){ game.click(indx); }
export function startGame(){ game.start(); }
export function initCard(callback){
	if (!game.setValue) game.setValue = [];
	game.setValue.push(callback);
}
export function saveGame(){ game.save(); }
export function getGameInfo(){ return game.getInfo(); }
export function setMode1(options){ game.setMode1(options); }
export function setMode2(level, totalScore){ game.setMode2(level, totalScore); }
