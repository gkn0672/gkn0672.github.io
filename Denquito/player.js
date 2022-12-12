import { Running, Lifting, Attacking } from "./playerstates.js";

export class Player {
    constructor(game) {
        this.game = game;
        this.width = 114.28;
        this.height = 198;
        this.x = 300;
        this.y = this.game.height - this.height - this.game.groundmargin;
        this.velocity = 0;
        this.weight = 1;
        this.image = document.getElementById("player");
        this.framex = 0;
        this.framey = 0;
        this.maxframe = 6;
        this.fps = 60;
        this.frameInterval = 1000/this.fps;
        this.frametimer = 0; 
        this.states = [new Running(this), new Lifting(this),new Attacking(this)];
        this.currentstates = this.states[0];
        this.currentstates.enter();
        this.staggerFrames = 10;
        this.currentFrameX = 0;
        this.currentFrameY = 0;
        this.currentgFrame = 0;
    }

    update(input, deltatime){
        this.currentstates.handleInput(input);

        //Horizontal
        if(this.x < 0) this.x = 0;
        if(this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        //Sprite animation
        if(this.frametimer > this.frameInterval){
            this.frametimer = 0; 
            if(this.framex < this.maxframe) this.framex ++;
            else this.framex = 0;
        }else{
            this.frametimer += deltatime;
        }
    }

    draw(context){
        context.fillStyle = "blue";
        context.strokeRect(this.x, this.y, this.width, this.height);
        let position = Math.floor(this.currentgFrame/this.staggerFrames) % this.maxframe;
        this.currentFrameX = this.width * position;
        context.drawImage(this.image, this.currentFrameX, this.currentFrameY * this.height , this.width, this.height, this.x, this.y, this.width, this.height);
        this.currentgFrame++;
        //draw image
    }

    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundmargin;
    }

    setState(state, speed){
        this.currentstates = this.states[state];
        this.game.speed = this.game.maxspeed * speed;
        this.currentstates.enter();
    }
}