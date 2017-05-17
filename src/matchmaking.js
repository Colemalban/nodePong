/*jshint esversion:6*/

/*
 * This module will handle the matchmaking functionality of the server
 *TODO enqueue clients, start a game, clear out queue, clean out the queue, get size of queue
 */

class Matchmaker{
    constructor(queue){
        this.playerQueue = queue;
    }

    enqueue(player){
        this.playerQueue.shift(player);
    }

    isReadyToStartGame(){
        //TODO return a boolean indicating if the game is ready to start 
    }

    clearQueue(){
        //TODO empty the queue 
    }

    cleanQueue(){
        //TODO remove any dead clients from the queue 
    }

    createGame(){
        //TODO start a game with two players 
    }

    playersQueued(){
        //TODO return size of the queue 
    }
}

module.exports = Matchmaker;
