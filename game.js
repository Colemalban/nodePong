/*jshint esversion:6*/

class Game{
    constructor(playerOne,playerTwo){
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.playerOneScore = 0;
        this.playerTwoScore = 0;
        this.SCORE_LIMIT = 1;
        this.playerOneY = 10;
        this.playerTwoY = 10;
        this.playerOneVelocity = 0;
        this.playerTwoVelocity = 0;
        this.ballX = 250;
        this.ballY = 250;
        this.ballVelocityX = 3;
        this.ballVelocityY = 3;
        this.gameLoop = null;//To be the interval running the game loop
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
        this.checkForScore();
        if(this.checkForVictory() === true){
            clearInterval(this.gameLoop);
            return true;
        }
        this.ballX += this.ballVelocityX;
        this.ballY += this.ballVelocityY;
        this.playerOneY += this.playerOneVelocity;
        this.playerTwoY += this.playerTwoVelocity;
        return false;
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
    
    checkForVictory(){
        if(this.playerOneScore >= this.SCORE_LIMIT){
            this.playerOne.websocket.send(JSON.stringify({status:"end_game",victory:true}));
            this.playerTwo.websocket.send(JSON.stringify({status:"end_game",victory:false}));
            console.log("SENDING VICTORY FOR ONE");
            return true;
        }
        if(this.playerTwoScore >= this.SCORE_LIMIT){
            this.playerOne.websocket.send(JSON.stringify({status:"end_game",victory:false}));
            this.playerTwo.websocket.send(JSON.stringify({status:"end_game",victory:true}));
            console.log("SENDING VICTORY FOR TWO");
            return true;
        }
        return false;
    }

    checkForScore(){
        if(this.ballX > 730){
            this.playerOneScore += 1;
            this.resetBall();
        }
        else if(this.ballX < 10){
            this.playerTwoScore += 1;
            this.resetBall();
        }
    }

    resetBall(){
        this.ballX = 250;
        this.ballY = 250;
        this.ballVelocityX = 3;
        this.ballVelocityY = 3;
    }

    startGame(){
        var game = this;
        this.playerOne.websocket.send(JSON.stringify({status:"start_game",player:1}));
        this.playerTwo.websocket.send(JSON.stringify({status:"start_game",player:2}));
        this.gameLoop = setInterval(function(){
            var gameOver = game.updateCoordinates();
            if(gameOver === true){
                return;
            }
            game.playerOne.websocket.send(JSON.stringify(game.getCoordinates()));
            game.playerTwo.websocket.send(JSON.stringify(game.getCoordinates()));
        },20);
    }


}

module.exports = Game;
