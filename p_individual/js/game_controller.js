var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
var temps = 0;

class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
        this.username = sessionStorage.getItem("username","unknown");
        this.cards = null;
        this.numCards = JSON.parse(json).cards;
        this.dificulty = JSON.parse(json).dificulty;
        this.firstClick = null;
        this.score = 100;
        this.correct = 0;
    }

    preload (){	
		this.load.image('back', '../resources/back.png');
		this.load.image('cb', '../resources/cb.png');
		this.load.image('co', '../resources/co.png');
		this.load.image('sb', '../resources/sb.png');
		this.load.image('so', '../resources/so.png');
		this.load.image('tb', '../resources/tb.png');
		this.load.image('to', '../resources/to.png');
	}
	
    create (){
		if (this.dificulty === "normal" ) temps = 1000;
        else if (this.dificulty === "easy" ) temps = 2000;
        else if (this.dificulty === "hard" ) temps = 500;


		let arraycards = ['cb', 'co', 'sb', 'so', 'tb', 'to'];
		this.cameras.main.setBackgroundColor(0xBFFCFF);
		Phaser.Utils.Array.Shuffle(arraycards);
        arraycards = arraycards.slice(0, this.numCards);
        arraycards = arraycards.concat(arraycards);
        Phaser.Utils.Array.Shuffle(arraycards);
		var pos_x = 250;
		var pos_y = 300;
		for (let i = 0; i < arraycards.length; i++) {
			this.add.image(pos_x,pos_y,arraycards[i]);
			if(i===3 || i===7){
				pos_x = 250;
				pos_y += 200;
			}
			else if(i>3){
				pos_x+=100;
				pos_y=500;
			}
			else if(i<3){
				pos_x+=100;
			}
		}
		
		this.cards = this.physics.add.staticGroup();
		setTimeout(() => {
			pos_x = 250;
			pos_y = 300;
			for (let i = 0; i < arraycards.length; i++) {
				this.cards.create(pos_x,pos_y,'back');
				if(i===3 || i===7){
					pos_x = 250;
					pos_y += 200;
				}
				else if(i>3){
					pos_x+=100;
					pos_y=500;
				}
				else if(i<3){
					pos_x+=100;
				}
			}
			
			let i = 0;
			this.cards.children.iterate((card)=>{
				card.card_id = arraycards[i];
				i++;
				card.setInteractive();
				card.on('pointerup', () => {
					card.disableBody(true,true);
					if (this.firstClick){
						if (this.firstClick.card_id !== card.card_id){
							this.score -= 20;
							this.firstClick.enableBody(false, 0, 0, true, true);
							setTimeout(() => {
								card.enableBody(false, 0, 0, true, true);
							}, temps-100);
							if (this.score <= 0){
								alert("Game Over");
								loadpage("../");
							}
						}
						else{
							this.correct++;
							if (this.correct >= this.numCards){
								alert("You Win with " + this.score + " points.");
								loadpage("../");
							}
						}
						this.firstClick = null;
					}
					else{
						this.firstClick = card;
					}
				}, card);
			});
		}, temps);
	}
	update (){	}
}
