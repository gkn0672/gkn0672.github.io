/** @type {HTMLCanvasElement} */
import { Player } from "./player.js";
import { Background } from "./background.js";
import { InputHandle } from "./input.js";
import { MosquitoKing, HardenedSoil, Bucket, FlowerPlate } from "./enemies.js";
import {UI} from "./ui.js";

window.addEventListener('load', function(){
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 1024;
    canvas.height = 600;

    const canvas2 = document.getElementById("canvas2");
    const ctx2 = canvas2.getContext("2d");
    canvas2.width = 170;
    canvas2.height = 170;

    canvas2.addEventListener('mousedown',function(e){mousedown(canvas2, ctx2, e)});
    canvas2.addEventListener('mousemove',function(e){mousemove(canvas2, ctx2, e)});
    canvas2.addEventListener('mouseup',mouseup);

    var isMouseDown = false;
    var drawx = 0;
    var drawy = 0;
    var prex = 0;
    var prey = 0;
    var movement = ""

    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.groundmargin = 50;
            this.speed = 1;
            this.maxspeed = 2;
            this.enemies = [new MosquitoKing(this)];
            this.boss = this.enemies[0];
            this.enemyTimer = 0;
            this.enemyInterval = 3500;
            this.player = new Player(this);
            this.input = new InputHandle();
            this.UI = new UI(this);
            this.background = new Background(this);
            this.fontColor = 'black';
            this.score = 0;
            this.gameover = false;
            this.speedup = 0;
        }

        update(deltatime){
            //call check collision
            if(this.speedup != 0 && this.speedup % 10 == 0){
                this.speed += 0.01;
                this.enemyInterval -= 10;
                this.speedup = 0;
                console.log(this.speed)
            }

            this.boss.checkdeadzone();
            this.background.update();
            this.player.update(this.input.keys, deltatime);

            //enemies
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            }
            else{
                this.enemyTimer += deltatime;
            }

            this.enemies.forEach(enemy => {
                enemy.update(deltatime);
                if(enemy.marked) this.enemies.splice(this.enemies.indexOf(enemy), 1)
            });
        }

        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.UI.draw(context);
        }

        addEnemy(){
            if(Math.random() < 0.5){
                this.enemies.push(new HardenedSoil(this));
            }
            else{
                this.enemies.push(new Bucket(this));
            }
        }

        addBoss(){
            this.enemies.push(new MosquitoKing(this));
        }

        increaseDeadZone(){
            this.boss.x += 15;
            this.player.x += 15;
        }
    }

    const game = new Game(canvas.width, canvas.height);
    //game.addBoss();
    let lasttime = 0;

    function getPos(canvas2, e){
        var rect = canvas2.getBoundingClientRect();
        return{
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    function mousedown(canvas2, ctx2, e){
        isMouseDown = true
        movement = ""
        var curr = getPos(canvas2, e)
        drawx = curr.x
        drawy = curr.y
    }
    
    /*
        Based on numpad
        7 8 9
        4 5 6
        1 2 3
        up = 8
        down = 2
        left = 4
        right = 6
    */

    function mousemove(canvas2, ctx2, e){
        if(isMouseDown){
            var curr = getPos(canvas2, e)
            drawx = curr.x
            drawy = curr.y
            if (drawx > prex && drawy == prey){
               // console.log("right")
               movement += "6"
            }
            
            if (drawx < prex && drawy == prey){
               // console.log("left")
               movement += "4"
            }
            
            if (drawy > prey && drawx == prex){
               // console.log("down")
               movement += "2"
            }
            
            if (drawy < prey && drawx == prex){
               // console.log("up")
               movement += "8"
            }
    
            ctx2.fillstyle = 'yellow';
            ctx2.fillRect(drawx, drawy, 3, 3);


            prex = drawx;
            prey = drawy;
        }
    }
    
    function mouseup(){
        isMouseDown = false;
        if(movement != ""){
            console.log(movement);
            check(game, movement);
        }

        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    }

    function levenshtein(movement, data){
        var dp = new Array(data.length + 1);
        for(var i=0; i<dp.length; i++){
            dp[i] = new Array(movement.length + 1);
        }

        for(var i=0; i<dp.length; ++i){
            dp[i][0] = i;
        }

        for(var i=0; i<dp[0].length; ++i){
            dp[0][i] = i;
        }

        for(var row = 1; row<dp.length; ++row){
            for(var col = 1; col<dp[0].length; ++col){
                if(movement[col-1] == data[row-1]){
                    dp[row][col] = dp[row-1][col-1];
                }
                else{
                    dp[row][col] = Math.min(dp[row][col-1], dp[row-1][col], dp[row-1][col-1]) + 1;
                }
            }
        }
        return dp[dp.length - 1][dp[0].length - 1];
    }

    function check(game, movement){
        var gamewidth = game.width;
        var enemies = game.enemies;
        var data = [`42222222222222222222222222222222222222222222222222222222222222`,
                    `8888888888888888888888866666222242444466666666666622222444444444444444444`, 
                    `44444444444444422222222222626666666686668888888888888444844844444`, 
                    `44444444444444444444422222222222222222222266666666666666666666666`];
        var checkboard = [];
        var anschar = ["L", "B", "O", "C"];

        data.forEach(entry => {
            checkboard.push(levenshtein(movement, entry));
        });
        
        var minchar = Math.min.apply(null, checkboard);
        console.log(minchar);
        var finans;
        if(minchar < 60){
            finans = anschar[checkboard.indexOf(minchar)];
            console.log(minchar);
            console.log(finans);
        }

        enemies.forEach(enemy =>{
            if(finans == enemy.hitcode){
                //enemy.marked = true;
                enemy.damaged();
                //game.player.target.push(enemy.hitcode);
            }
        })
    }

    function animate(timestamp){
        const deltatime =  timestamp - lasttime;
        lasttime = timestamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.draw(ctx);
        if(game.gameover == false){
            game.update(deltatime);
            requestAnimationFrame(animate)
        }
        else{
            // game.update(deltatime);
            // requestAnimationFrame(animate)
            //alert('Game Over!')
        }
    }

    animate(0);
});