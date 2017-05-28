//TODO for some reason the winning mechanic is backwards eg: When player one wins, they get a losing message
/*jshint esversion:6*/

const WebSocket = require('ws');
const Client = require('./src/client.js');
const Game = require('./src/game.js');
const Matchmaker = require('./src/matchmaking');
const http = require('http');
const fs = require('fs');

const serverPort = '80';
const serverIP = '0.0.0.0';
const wss = new WebSocket.Server({host:'0.0.0.0',port:3000});
const matchmaker = new Matchmaker([]);

//Create static server
const server = http.createServer((req,res)=>{
    if(req.url.includes("static")){
        serveFile(`./${req.url}`,req,res);
    }
    else{
        serveFile('./static/views/index.html',req,res);
    }
});

function serveFile(filePath, req, res){
    fs.readFile(filePath,'utf8', (err,data)=>{
        if(err){
            throw err;
        }
        else{
            res.writeHead(200, {'Content-Type':"text/html"});
            res.write(data);
            res.end();
        }
    });
}

server.listen(serverPort, serverIP);

//On new connection, create a new client object
wss.on('connection', (ws)=>{
    matchmaker.cleanQueue();
    matchmaker.enqueue(new Client(ws));
    if(matchmaker.gameAvailable() === true ){
        let game = matchmaker.createGame();
        game.startGame();
    }
});
