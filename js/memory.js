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
	ctx.fillStyle = type === back ? "#1f6feb" : "#ffffff";
	ctx.strokeStyle = selected ? "#f1c40f" : "#1f2937";
	ctx.fillRect(x, y, width, height);
	ctx.strokeRect(x, y, width, height);

	if (type === back){
		ctx.fillStyle = "#58a6ff";
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

var game = {
	items: [],
	states: [],
	setValue: null,
	ready: 0,
	selected: [],
	score: 220,
	groupsLeft: 0,
	group: 2,
	mode: 1,
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
		this.numCards = Number(options.numCards) || 12;
		this.group = Number(options.group) || 2;
		this.difficulty = options.difficulty || "normal";

		if (!difficultyConfig[this.difficulty]) this.difficulty = "normal";

		const remainder = this.numCards % this.group;
		if (remainder !== 0) this.numCards -= remainder;

		const maxCards = resources.length * this.group;
		if (this.numCards > maxCards) this.numCards = maxCards;
		if (this.numCards < this.group) this.numCards = this.group;

		const config = difficultyConfig[this.difficulty];
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
			this.groupsLeft = toLoad.groupsLeft ?? toLoad.pairs ?? 0;
			this.group = toLoad.group;
			this.difficulty = toLoad.difficulty || "normal";
			this.mode = toLoad.mode || 1;
			this.numCards = this.items.length;
			const config = difficultyConfig[this.difficulty] || difficultyConfig.normal;
			this.penalty = config.penalty;
			this.initialTime = config.initialTime;
			this.failTime = config.failTime;
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
					alert("Has perdut");
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
				alert(`Has guanyat amb ${this.score} punts!`);
				window.location.assign("../");
			}
		}
	},
	save: function(){
		let to_save = JSON.stringify({
			items: this.items,
			states: this.states,
			selected: this.selected,
			score: this.score,
			groupsLeft: this.groupsLeft,
			group: this.group,
			difficulty: this.difficulty,
			mode: this.mode
		});
		localStorage.save = to_save;
		console.warn("La partida s'ha guardat en local.");
		window.location.assign("../");
	},
	getInfo: function(){
		return {
			score: this.score,
			groupsLeft: this.groupsLeft,
			group: this.group,
			difficulty: difficultyConfig[this.difficulty]?.label || this.difficulty,
			numCards: this.numCards,
			mode: this.mode
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
