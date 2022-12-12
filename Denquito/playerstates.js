const states = {
    RUNNING: 0,
    LIFTING: 1,
    ATTACKING: 2,
}

class State {
    constructor(state){
        this.state = state;
    }
}

export class Running extends State {
    constructor(player){
        super('RUNNING');
        this.player = player;
    }

    enter(){
        //this.framex = 0
        //this.framey = ??
        //this.player.maxframe = ??
        //set sprite sheet frame Y
    }

    handleInput(input){
    }
}

export class Lifting extends State {
    constructor(player){
        super('LIFTING');
        this.player = player;
    }

    enter(){
        if(this.player.onGround()){
            this.player.velocity -= 2;
        } 
        //set sprite sheet frame Y
    }

    handleInput(input){
    }
}

export class Attacking extends State {
    constructor(player){
        super('ATTAKING');
        this.player = player;
    }

    enter(){
        //this.framex = 0
        //this.framey = ??
        //this.player.maxframe = ??
        //set sprite sheet frame Y
        var currenttarget = this.player.target.pop();
        if(currenttarget == "B"){
            //Break animation
        }
        else if(currenttarget == "O"){
            //Lift animation
        }
        else{
            this.player.setState(states.RUNNING, 0.5);
        }
    }
}
