/*jshint esversion:6*/

const Game = require('./game');

/*
 * This module will handle the matchmaking functionality of the server
 */

class Matchmaker{
    constructor(queue){
        this.clientQueue = queue;
    }

    enqueue(player){
        this.clientQueue.push(player);
    }

    gameAvailable(){
        this.cleanQueue();
        if(this.clientQueue.length >= 2){
            return true;
        }
        return false;
    }

    clearQueue(){
        //TODO should each connection be closed before clearing?
        this.clientQueue = [];
    }

    cleanQueue(){
        //TODO does cleanup need to be done on each socket connection before close?
        this.clientQueue = this.clientQueue.filter(function(client){
            return client.alive;
        });
    }

    createGame(){
        this.cleanQueue();
        if(this.gameAvailable()){
            let playerOne = this.clientQueue.shift();
            let playerTwo = this.clientQueue.shift();
            return new Game(playerOne, playerTwo);
        }
        return null;
    }

    clientCount(){
        this.cleanQueue();
        return this.clientQueue.length;
    }
}

module.exports = Matchmaker;
