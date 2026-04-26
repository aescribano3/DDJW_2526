const resources = ['../resources/cb.png', '../resources/co.png',
                '../resources/sb.png', '../resources/so.png',
                '../resources/tb.png', '../resources/to.png'];
const back = '../resources/back.png';

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
    group: 2,
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
            this.selected = toLoad.selected || [];
            this.score = toLoad.score;
            this.pairs = toLoad.pairs;
        }
        else{ // Nova partida
            this.items = resources.slice();          
            shuffe(this.items);                      
            this.items = this.items.slice(0, this.pairs);
            var itemsCopy = this.items.slice();
            for (let i = 1; i < this.group; i++) {
                this.items = this.items.concat(itemsCopy);
            }
            shuffe(this.items);
            this.states = new Array(this.items.length);
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
        if (this.items[indx] !== first){
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
            pairs: this.pairs
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