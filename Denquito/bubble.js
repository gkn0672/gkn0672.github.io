class Bubble{
    constructor(enemy, game){
        this.game = game;
        this.enemy = enemy;
        this.content = enemy.hit.length;
        this.bubblewidth = 50;
        this.bubbleheight = 50;
        this.locx = this.enemy.x;
    }

    update(){
        this.content = this.enemy.hit.length;
        this.locx = this.enemy.x;
    }

    draw(context){
        var startx = this.locx + (this.enemy.width / 2);
        for(var i=0; i<this.enemy.hit.length; i++){
            context.drawImage(this.bubbleimage, startx - ((this.enemy.hit.length - i) * this.bubblewidth / 2), this.enemy.y - this.bubbleheight - 10, this.bubblewidth, this.bubbleheight);
        }
    }
}

export class BBubble extends Bubble{
    constructor(enemy, game){
        super(enemy, game);
        this.bubbleimage = document.getElementById('bbubble');
    }

    update(){
        super.update();
    }

    draw(context){
        super.draw(context);
    }
}

export class OBubble extends Bubble{
    constructor(enemy, game){
        super(enemy, game);
        this.bubbleimage = document.getElementById('obubble');
    }

    update(){
        super.update();
    }

    draw(context){
        super.draw(context);
    }
}

export class LBubble extends Bubble{
    constructor(enemy, game){
        super(enemy, game);
        this.bubbleimage = document.getElementById('lbubble');
    }

    update(){
        super.update();
    }

    draw(context){
        super.draw(context);
    }
}