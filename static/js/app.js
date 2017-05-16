/*jshint esversion:6*/

var canvas = document.getElementById("gameBoard");
var ctx = canvas.getContext("2d");
var gameSocket = new WebSocket("ws://localhost:3000");

var ball = new Ball();
var leftPaddle = new Paddle(1);
var rightPaddle = new Paddle(0);
var myPaddle;

const OPEN_CONNECTION = 1;
const MOVE_PADDLE = 2;

//Handlers for keydown
document.body.onkeydown = function(event){
    console.log(event.keyCode);
    if(event.keyCode == 40){
        gameSocket.send(JSON.stringify({request:MOVE_PADDLE,direction:"down"}));
    }
    if(event.keyCode == 38){
        gameSocket.send(JSON.stringify({request:MOVE_PADDLE,direction:"up"}));
    }
};

//Handler for keyup
document.body.onkeyup = function(){
    gameSocket.send(JSON.stringify({request:MOVE_PADDLE,direction:"stop"}));
};


var playerName = prompt("What is your username?");
findGame();

//Main loop
function findGame(){
    var state = 0;
    var stateDrawing = setInterval(function(){state = drawSearching(state);}, 250);
    gameSocket.onopen = function(event){
        gameSocket.send(JSON.stringify({player:playerName,request:OPEN_CONNECTION}));
    };
    gameSocket.onmessage = function(event){
        var message = JSON.parse(event.data);
        if(message.status == "start_game"){
            clearInterval(stateDrawing);
            if(message.player === 1){
                myPaddle = leftPaddle;
            }
            else{
                myPaddle = rightPaddle;
            }
        }
        if(message.status == "playing"){
            console.log(message);
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ball.updatePosition(message.ballX, message.ballY);
            ball.draw();
            leftPaddle.updatePosition(message.playerOneCoordinate);
            leftPaddle.draw();
            rightPaddle.updatePosition(message.playerTwoCoordinate);
            rightPaddle.draw();
        }
    };
}


//Draw the searching for game animation 
function drawSearching(state){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.font = "50px Arial";
    switch(state){
        case 0:
            ctx.fillText("Searching for game",100,100);
            return state + 1;
        case 1:
            ctx.fillText("Searching for game .",100,100);
            return state + 1;
        case 2:
            ctx.fillText("Searching for game . .",100,100);
            return state + 1;
        case 3:
            ctx.fillText("Searching for game . . .",100,100);
            return 0;
        default:
            ctx.fillText("Searching ... ",100,100);
            console.log("ERROR IN STATE MACHINE");
    }
}

