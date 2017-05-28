//TODO for some reason the winning mechanic is backwards eg: When player one wins, they get a losing message
/*jshint esversion:6*/

const WebSocket = require('ws');
const Client = require('./src/client.js');
const Game = require('./src/game.js');
const Matchmaker = require('./src/matchmaking');
const express = require('express');
const http = require('http');
const path = require('path');
var argv = require('yargs').argv;

//Constants
const PORT = '80';
const PUBLIC_IP= '0.0.0.0';
const LOCAL_IP = '127.0.00.1';

const app = express();
const matchmaker = new Matchmaker([]);


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'static','views','index.html'));
});

app.use('/static',express.static(path.join(__dirname,'static')));

//Create static server
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

IP = PUBLIC_IP;
if(argv.local){
    IP = LOCAL_IP;
}
server.listen(PORT,IP);
console.log("Server up and running");
//On new connection, create a new client object
wss.on('connection', (ws)=>{
    matchmaker.cleanQueue();
    matchmaker.enqueue(new Client(ws));
    if(matchmaker.gameAvailable() === true ){
        let game = matchmaker.createGame();
        game.startGame();
    }
});
