/*jshint esversion:6*/

const OPEN_CONNECTION = 1;
const MOVE_PADDLE = 2;

class Client{
    constructor(websocket){
        this.websocket = websocket;
        this.alive = true;
        this.websocket.on('message', (msg) => {
            var data = JSON.parse(msg);
            switch (data.request) {
                case(OPEN_CONNECTION):
                    this.name = data.player;                   
                    break;
                case(MOVE_PADDLE):
                    this.onPaddleMove(data.direction);                    
                    break;
                default:
                    break;
            }
        });
        this.websocket.on('close',()=>{
            this.alive = false;
        });
        this.onPaddleMove = function(){};
    }
}

module.exports = Client;
