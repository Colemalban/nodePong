/*jshint esversion:6*/

class Game{
    //TODO break this into two player objects, paddle objects, and a ball object 
    constructor(playerOne, playerTwo){
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.playerOneScore = 0;
        this.playerTwoScore = 0;
        this.SCORE_LIMIT = 1;
        this.playerOneY = 10;
        this.playerTwoY = 10;
        this.playerOneVelocity = 0;
        this.playerTwoVelocity = 0;
        this.ball = new Ball();
        this.gameLoop = null;//To be the interval running the game loop
        var game = this;

        //TODO break this off into their own functions maybe(make things look cleaner)
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
        this.ballIsOutOfBounds();
        this.ballX += this.ballVelocityX;
        this.ballY += this.ballVelocityY;
        if(this.playerOneY <= 650 && this.playerOneY >= 0){
            this.playerOneY += this.playerOneVelocity;
        }
        if(this.playerTwoY <= 650 && this.playerTwoY >= 0){
            this.playerTwoY += this.playerTwoVelocity;
        }
        return false;
    }

    //TODO rename this so it isnt a boolean thing. Or should it return something instead maybe? like the velocity 
    ballIsOutOfBounds(){
        //TODO check if ball is colliding with paddle and if so, reverse the x direction some how 
        if(this.ballY >= 740 || this.ballY <= 10){
            this.ballVelocityY *= -1;
        } 
        if(this.ballHittingPaddle()){
            this.ballX *= -1;
        }
    }

    ballHittingPaddle(){
        if((this.ballX >= 730 && this.ballX <= 740) && (this.ballY >= this.playerTwoY && this.ballY <= this.playerTwoY + 100)){
            return true;
        }
        if((this.ballX >= 10 && this.ballX <= 20) && (this.ballY >= this.playerOneY && this.ballY <= this.playerOneY + 100)){
            return true;
        }
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
            return true;
        }
        if(this.playerTwoScore >= this.SCORE_LIMIT){
            this.playerOne.websocket.send(JSON.stringify({status:"end_game",victory:false}));
            this.playerTwo.websocket.send(JSON.stringify({status:"end_game",victory:true}));
            return true;
        }
        return false;
    }

    updateScore(){
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
        let game = this;
        this.playerOne.websocket.send(JSON.stringify({status:"start_game",player:1}));
        this.playerTwo.websocket.send(JSON.stringify({status:"start_game",player:2}));
        this.gameLoop = setInterval(function(){
            game.updateScore();
            if(game.checkForVictory() === true){
                clearInterval(game.gameLoop);
                return;
            }
            game.updateCoordinates();
            game.playerOne.websocket.send(JSON.stringify(game.getCoordinates()));
            game.playerTwo.websocket.send(JSON.stringify(game.getCoordinates()));
        },20);
    }


}

module.exports = Game;
