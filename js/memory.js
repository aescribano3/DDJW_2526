const resources = [
"circle",
"square",
"triangle",
"diamond",
"star",
"cross"
];
const back = "back";

function drawCard(ctx, type, x, y, size){

	ctx.fillStyle = "#ffffff";
	ctx.fillRect(x,y,size,size);
	ctx.strokeRect(x,y,size,size);

	ctx.fillStyle = "#2c3e50";

	let cx = x + size/2;
	let cy = y + size/2;

	switch(type){

	case "circle":
		ctx.beginPath();
		ctx.arc(cx,cy,size/4,0,Math.PI*2);
		ctx.fill();
	break;

	case "square":
		ctx.fillRect(cx-size/4,cy-size/4,size/2,size/2);
	break;

	case "triangle":
		ctx.beginPath();
		ctx.moveTo(cx,cy-size/3);
		ctx.lineTo(cx-size/3,cy+size/3);
		ctx.lineTo(cx+size/3,cy+size/3);
		ctx.closePath();
		ctx.fill();
	break;

	case "diamond":
		ctx.beginPath();
		ctx.moveTo(cx,cy-size/3);
		ctx.lineTo(cx-size/3,cy);
		ctx.lineTo(cx,cy+size/3);
		ctx.lineTo(cx+size/3,cy);
		ctx.closePath();
		ctx.fill();
	break;

	case "star":
		for(let i=0;i<5;i++){
			let angle=i*2*Math.PI/5-Math.PI/2;
			let x1=cx+Math.cos(angle)*size/3;
			let y1=cy+Math.sin(angle)*size/3;
			let angle2=angle+Math.PI/5;
			let x2=cx+Math.cos(angle2)*size/6;
			let y2=cy+Math.sin(angle2)*size/6;
			ctx.beginPath();
			ctx.moveTo(cx,cy);
			ctx.lineTo(x1,y1);
			ctx.lineTo(x2,y2);
			ctx.fill();
		}
	break;

	case "cross":
		ctx.fillRect(cx-size/8,cy-size/3,size/4,2*size/3);
		ctx.fillRect(cx-size/3,cy-size/8,2*size/3,size/4);
	break;

	case "back":
		ctx.fillStyle="#3498db";
		ctx.fillRect(x,y,size,size);
	break;

	}
}

const StateCard = Object.freeze({
  DISABLE: 0,
  ENABLE: 1,
  DONE: 2
});

var game = {
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    selected: [],
    score: 200,
    pairs: 2,
    group: 3,
	mode: 1,
	difficulty: "normal",
	numCards: 6,
    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
    select: function(){
        if (sessionStorage.load){ // Carreguem partida
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.selected = toLoad.selected;
            this.score = toLoad.score;
            this.pairs = toLoad.pairs;
			this.group = toLoad.group;
        }
		else{ // Nova partida
			let needed = this.pairs;
			this.items = resources.slice();
			shuffe(this.items);
			this.items = this.items.slice(0, needed);
			let itemsCopy = this.items.slice();
			for (let i = 1; i < this.group; i++){
				this.items = this.items.concat(itemsCopy);
			}
			shuffe(this.items);
			this.states = new Array(this.items.length).fill(StateCard.ENABLE);
		}
    },
    start: function(){
        this.items.forEach((_,indx)=>{
            if (this.states[indx] === StateCard.DISABLE ||
                this.states[indx] === StateCard.DONE){
                this.ready++;
            }
            else{
                setTimeout(()=>{
                    this.ready++;
                    this.goBack(indx);
                }, 1000 + 100 * indx);
            }
        });
    },
    click: function(indx){
        if (
            this.states[indx] !== StateCard.ENABLE ||
            this.ready < this.items.length ||
            this.selected.length >= this.group
        ) return;
        this.goFront(indx);
        this.selected.push(indx);
        let first = this.items[this.selected[0]];
        if (this.selected.length > 1 && this.items[indx] !== first){
            let cardsToHide = [...this.selected];
    
            setTimeout(() => {
                cardsToHide.forEach(i => this.goBack(i));
            }, 700);
    
            this.score -= 25;
    
            if (this.score <= 0){
                alert("Has perdut");
                window.location.assign("../");
            }
    
            this.selected = [];
            return;
        }
        if (this.selected.length === this.group){
            this.selected.forEach(i => this.states[i] = StateCard.DONE);
            this.pairs--;
            if (this.pairs <= 0){
                alert(`Has guanyat amb ${this.score} punts!!!!`);
                window.location.assign("../");
            }
            this.selected = [];
        }
    },
    save: function(){
		let to_save = JSON.stringify({
			items: this.items,
			states: this.states,
			selected: this.selected,
			score: this.score,
			pairs: this.pairs,
			group: this.group,
			difficulty: this.difficulty,
			mode: this.mode
		});
        let ret = false;
        fetch('../php/save.php', {
            method: "POST",
            body: to_save,
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => ret = JSON.parse(response))
        .catch (err => console.error(err));

        if (!ret) {
            console.warn("La partida s'ha guardat en local.");
            localStorage.save = to_save;
        }
        window.location.assign("../");
    }
}

function shuffe(arr){
    arr.sort(function () {return Math.random() - 0.5});
}

export var gameItems;
export function selectCards() { 
    game.select();
    gameItems = game.items;
}
export function clickCard(indx){ game.click(indx); }
export function startGame(){ game.start(); }
export function initCard(callback) { 
    if (!game.setValue) game.setValue = [];
    game.setValue.push(callback); 
}
export function saveGame(){
    game.save();
}
export function setMode1(options){
    game.mode = 1;

    game.numCards = options.numCards;
    game.group = options.group;
    game.difficulty = options.difficulty;

    game.pairs = Math.floor(game.numCards / game.group);

    if (game.difficulty === "easy") game.score = 300;
    if (game.difficulty === "normal") game.score = 200;
    if (game.difficulty === "hard") game.score = 150;
}