//Final Assignment
//Joseph Eiles
//3152600

//Sources:

//How to splice array elements: 
//https://love2dev.com/blog/javascript-remove-from-array/

//Used line 243 for a new collision detection function
//http://www.newthinktank.com/2019/07/javascript-asteroids/

//Calculating distance between two points:
//https://stackoverflow.com/questions/20916953/get-distance-between-two-points-in-canvas

//Bullet trajectory towards mouse function:
//https://stackoverflow.com/questions/48493189/shooting-bullets-from-player-towards-mouse

//Displaying javascript variables as an HTML element:
//https://www.quora.com/How-can-I-display-variables-in-HTML-that-are-determined-by-Javascript

//KNOWN LIMITATIONS:
//Sometimes the player and asteroid object will spawn too close or inside one another. If this happens then refresh the page.
//Due to a previous issue where a constant projectile would stay on the screen when the mouse is clicked you can only fire a projectile when the player object is not moving; keyboard presses clear the projectile array

//Variables
var canvas;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var w = 600;
var h = 600;

//Arrays where objects are pushed
var composition = [];
var projectileComposition = [];
var asteroidComposition = [];

//Global Variables
let clickCoordx = 0;
let clickCoordy = 0;
let allAsteroidSpeedIncrement = 0;
let score = 0;

//Variable that stores the score value that will be referenced in the HTML file
var myScoreDiv = document.getElementById('score');

//Player Object
class playerObject {
    //Class constructor with variables
    constructor(x, speedx, y, speedy, r, s, e, c, a)
    {
        this.x = x;
        this.speedx = speedx;
        this.y = y;
        this.speedy = speedy;
        this.r = r;
        this.s = s;
        this.e = e;
        this.c = c;
        this.a = a;
    }
    //Updates the x and y coordinates of the player object
    updateData()
    {
        this.x += this.speedx;
        this.y += this.speedy;

        //if(this.x+this.r > w || this.x-this.r < 0){this.speedx *= -1};
        //if(this.y+this.r > h || this.y-this.r < 0){this.speedy *= -1};
        
    }
    //Draws the player object
    drawCircle()
    {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, this.s, this.e);
        ctx.fillStyle = 'gold';
        ctx.fill();
    }
    //Splices the player object from the collection
    destroy()
    {
        ctx.fillStyle = 'red';
        ctx.fill();
        for(let p = 0; p < composition.length; p++){
            if(composition[p] == this){
                composition.splice(p, 1);
                break;
            }
        }
    }
}

//Player Projectile Object
class playerProjectile {
    //Class constructor with variables
    constructor(x, speedx, y, speedy, r, s, e, c, a)
    {
        this.x = x;
        this.speedx = speedx;
        this.y = y;
        this.speedy = speedy;
        this.r = r;
        this.s = s;
        this.e = e;
        this.c = c;
        this.a = a;
    }
    //Updates the x and y coordinates of the player projectile object
    updateData()
    {
        this.x += this.speedx;
        this.y += this.speedy;
    }
    //Draws the player projectile object
    drawCircle()
    {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, this.s, this.e);
        ctx.fillStyle = 'red';
        ctx.fill();
    }
}

//Asteroid Object
class asteroid {
    //Class constructor with variables
    constructor(x, speedx, y, speedy, r, s, e, c, a)
    {
        this.x = x;
        this.speedx = speedx;
        this.y = y;
        this.speedy = speedy;
        this.r = r;
        this.s = s;
        this.e = e;
        this.c = c;
        this.a = a;
    }
    //Updates the x and y coordinates of the asteroid object. Object moves to the other side of the screen after passing the length and width of the canvas.
    updateData()
    {
        this.x += this.speedx;
        this.y += this.speedy;
        
        if(this.x+this.r > w+40 || this.x-this.r < -40)
        {
            this.x = this.x - w -40;
        };
        if(this.y+this.r > h+40 || this.y-this.r < -40)
        {
            this.y = this.y - h - 40;
        };
    }
    //Draws the asteroid object
    drawCircle()
    {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, this.s, this.e);
        ctx.fillStyle = 'gray';
        ctx.fill();
    }
    //Splices the asteroid object from the collection
    destroy()
    {
        ctx.fillStyle = 'red';
        ctx.fill();
        for(i = 0; i < asteroidComposition.length; i++){
            if(asteroidComposition[i] == this){
                asteroidComposition.splice(i, 1);
                break;
            }
        }
    }
}



//Initialization calls
setupCanvas();
playerSpawn(1, w/2, h/2);
asteroidSpawn(10);
animationLoop();


//Setup canvas initial state
function setupCanvas(){
    canvas = document.querySelector("#myCanvas");
    ctx = canvas.getContext("2d");
    canvas.style = "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; margin: auto";
    canvas.style.border = "6px solid gray";    
    canvas.width = w;
    canvas.height = h;
    //Captures mousedown events
    canvas.addEventListener('mousedown', function(event) {
        mousePressed(event);
    }, false);
    //Captures keyboard events
    document.addEventListener('keydown', function(event) {
        console.log("clicked" + event.keyCode);
        projectileComposition.length = 0;
        //Up arrow, moves the player object up
        if (event.keyCode == 38){

            for(var i = 0; i < composition.length; i++) 
            {
                composition[i].y += -10; 
            }
            console.log("up");
        }
        //Down arrow, moves the player object down
        if(event.keyCode == 40)
        {
            for(var i = 0; i < composition.length; i++) 
            {
                composition[i].y += 10; 
            }
            console.log("down");
        }
        //Left arrow, moves the player object left
        if(event.keyCode == 37)
        {
            for(var i = 0; i < composition.length; i++) 
            {
                composition[i].x += -10; 
            }
            console.log("left");
        }
        //Right arrow, moves the player object right
        if(event.keyCode == 39)
        {
            for(var i = 0; i < composition.length; i++) 
            {
                composition[i].x += 10; 
            }
            console.log("right");
        }
    }, false);
}

//When the mouse is clicked, creates a new projectile at mouse coordinates
function mousePressed(e){
  //Mouse coordinates are placed into global variables
  clickCoordx = e.offsetX;
  clickCoordy = e.offsetY;
  console.log("Clicked" +  clickCoordx + " " + clickCoordy);
  //Spawns projectile at player object's location, sets projectile trajectory through a function
  projectileSpawn(1, composition[0].x, composition[0].y);
  bulletTrajectory();
}

//Spawns player object
function playerSpawn(num, x, y){
    for(var i = 0; i < num; i++){
        var newPlayer = new playerObject( 
            x,
            0,
            y,
            0,
            10,
            0,
            2*Math.PI,
            200,
            0.5
            );
        //Pushes player character into the array
        composition.push(newPlayer);
    }
}


//Spawns projectile object
function projectileSpawn(num, x, y){
    for(var i = 0; i < num; i++){
        var newProjectile = new playerProjectile( 
            x,
            0,
            y,
            0,
            5,
            0,
            2*Math.PI,
            200,
            0.5
            );
        projectileComposition.push(newProjectile);
    }
    console.log(composition.x, composition.y);
}

//Spawns asteroid object
function asteroidSpawn(num){
    for(var i = 0; i < num; i++){
        var newAsteroid = new asteroid( 
            random(560),
            random(2.00),
            random(560),
            random(2.00),
            20,
            0,
            2*Math.PI,
            200,
            0.5
            );
        asteroidComposition.push(newAsteroid);
    }
}

//Detects collision between two points
function collisionDetection(p1x, p1y, r1, p2x, p2y, r2){
    var radiusSum;
    var xDiff;
    var yDiff;
    radiusSum = r1 + r2;
    xDiff = p1x - p2x;
    yDiff = p1y - p2y;
    if(radiusSum > Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))){
        return true;
    }else{
        return false;
    }
}

//Sets the trajectory of the projectile object
function bulletTrajectory(){
    for(i = 0; i < composition.length; i++){
        var a = clickCoordx - composition[i].x;
        var b = clickCoordy - composition[i].y;
        var c = Math.sqrt(a*a + b*b);
    
        a = a/c;
        b = b/c;
        
        for(m = 0; m < projectileComposition.length; m++){
            
            projectileComposition[m].x = composition[i].x;
            projectileComposition[m].y = composition[i].y
    
            projectileComposition[i].speedx = a*10.0;
            projectileComposition[i].speedy = b*10.0;
        }
    }
}

//Clears canvas, redraws and updates the coordinates of all objects in their respective arrays
function animationLoop(){
    clear();

    //Draws player object and updates values
    for(var i = 0; i < composition.length; i++)
    {
        var currentPlayer = composition[i];
        currentPlayer.drawCircle();
        currentPlayer.updateData();
            
    }
    //Draws player projectile object and updates values
    for(var i = 0; i < projectileComposition.length; i++)
    {
        var currentProjectile = projectileComposition[i];
        currentProjectile.drawCircle();
        currentProjectile.updateData();
    }
    //Draws asteroid object and updates values. The following conditionals detect collision between asteroid objects with player and projectile objects.
    for(let i = 0; i < asteroidComposition.length; i++)
    {
        var currentAsteroid = asteroidComposition[i];
        currentAsteroid.drawCircle();
        currentAsteroid.updateData();
        for(let k = 0; k < projectileComposition.length; k++){
            //If collision is detected with a projectile and asteroid instance then do the following:
            if(collisionDetection(projectileComposition[k].x, projectileComposition[k].y, 5, asteroidComposition[i].x, asteroidComposition[i].y, asteroidComposition[i].r)){
                console.log("hit");
                //Splices the current asteroid from the array
                currentAsteroid.destroy();
                //Increases a global speed variable which is then applied to new asteroids
                allAsteroidSpeedIncrement += 0.015;
                //Increments a global score variable and scores it within an html element
                score++;
                myScoreDiv.innerHTML = '<center> Score:&nbsp' + score + '</center>';
                //Creates a new asteroid object and pushes it into the array with the updated speed increment variable
                asteroidComposition.push(new asteroid(random(520)+40, random(2.00)+allAsteroidSpeedIncrement, 40, random(2.00)+allAsteroidSpeedIncrement, 20, 0, 2*Math.PI, 200, 0.5));
                
                console.log("Asteroid Speed" + allAsteroidSpeedIncrement);
                console.log("Score" + score);
            }
        }
        for(let b = 0; b < composition.length; b++){
            //If collision is detected with a player and asteroid instance then do the following:
            if(collisionDetection(composition[b].x, composition[b].y, 10, asteroidComposition[i].x, asteroidComposition[i].y, asteroidComposition[i].r)){
                console.log("Player Hit");
                //Splice the character object from the array
                currentPlayer.destroy();
                projectileComposition.length = 0;
                console.log("Game Over");
                myScoreDiv.innerHTML = '<center> Game Over </center>';
            }
        }
    }
    requestAnimationFrame(animationLoop);
}

//Generates a number within a range
function random(range){
    var r = Math.random()*range;
    return r
}

//Generates a negative number within a range
function nRandom(range){
	var r = Math.random()*range - (range/2); 
	return r
}

//Clears the canvas
function clear(){
	ctx.clearRect(0, 0, w, h); 
}