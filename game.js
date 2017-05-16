/*jshint esversion:6*/

class Game{
    constructor(playerOne,playerTwo){
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.playerOneY = 10;
        this.playerTwoY = 10;
        this.playerOneVelocity = 0;
        this.playerTwoVelocity = 0;
        this.ballX = 250;
        this.ballY = 250;
        this.ballVelocityX = 1;
        this.ballVelocityY = 1;
        var game = this;
        playerOne.onPaddleMove = function(direction){
            switch(direction){
                case "up":
                    game.playerOneVelocity = -6;
                    break;
                case "down":
                    game.playerOneVelocity = 6;
                    break;
                case "stop":
                    game.playerOneVelocity = 0;
                    break;
                default:
                    game.playerOneVelocity = 0;
            }
        };
        playerTwo.onPaddleMove = function(direction){
            switch(direction){
                case "up":
                    game.playerTwoVelocity = -6;
                    break;
                case "down":
                    game.playerTwoVelocity = 6;
                    break;
                case "stop":
                    game.playerTwoVelocity = 0;
                    break;
                default:
                    game.playerTwoVelocity = 0;
            }
        };
    }

    updateCoordinates(){
        this.ballX += this.ballVelocityX;
        this.ballY += this.ballVelocityY;
        this.playerOneY += this.playerOneVelocity;
        this.playerTwoY += this.playerTwoVelocity;
    }


    getCoordinates(){
        return {
            playerOneCoordinate: this.playerOneY,
            playerTwoCoordinate: this.playerTwoY,
            ballX: this.ballX,
            ballY: this.ballY,
            status:"playing",
        };
    }

    startGame(){
        var game = this;
        this.playerOne.websocket.send(JSON.stringify({status:"start_game",player:1}));
        this.playerTwo.websocket.send(JSON.stringify({status:"start_game",player:2}));
        setInterval(function(){
            game.updateCoordinates();
            game.playerOne.websocket.send(JSON.stringify(game.getCoordinates()));
            game.playerTwo.websocket.send(JSON.stringify(game.getCoordinates()));
        },20);
    }


}

module.exports = Game;
