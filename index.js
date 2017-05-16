/*jshint esversion:6*/

const WebSocket = require('ws');
const Client = require('./client.js');
const Game = require('./game.js');
const wss = new WebSocket.Server({port:3000});

waitingPlayerQueue = [];

//On new connection, create a new client object
wss.on('connection', (ws)=>{
    removeDeadClients(waitingPlayerQueue);
    waitingPlayerQueue.push(new Client(ws));
    if(waitingPlayerQueue.length % 2 === 0 && waitingPlayerQueue.length > 0){
        var playerOne = waitingPlayerQueue.shift();
        var playerTwo = waitingPlayerQueue.shift();
        var game = new Game(playerOne, playerTwo);
        game.startGame();
    }
});

function removeDeadClients(queue){
    for(var i = 0; i < queue.length; i++){
        var client = queue[i];
        if(client.websocket.alive === false){
            queue.splice(queue.indexOf(client),1);
        }
    }
    return queue;
}
