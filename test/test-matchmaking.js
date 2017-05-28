/*jshint esversion:6*/

const Matchmaker = require('../src/matchmaking');
const chai = require('chai');
const assert = chai.assert;


describe('Matchmaker', function(){

    describe('Enqueue', function(){
        it('Should enqueue a user to the connection queue',function(){
            var matchmaker = new Matchmaker([]);
            matchmaker.enqueue({name:"Cole",alive:true});
            assert(1 === matchmaker.clientQueue.length,"Player not enqueued");
        });
        it('Should add new users to the back of the queue', function(){
            var matchmaker = new Matchmaker([]);
            matchmaker.enqueue({name:"Cole",alive:true});
            matchmaker.enqueue({name:"Derek",alive:true});
            assert(matchmaker.clientQueue[1].name === "Derek","Player 'Derek' not added to end of queue");
            assert(matchmaker.clientQueue.length === 2, "Both players not added toq ueue");
        });
    });

    describe('Game is ready',function(){
        it('Should not be ready with only one or zero users', function(){
            var matchmaker = new Matchmaker([]);
            assert(false === matchmaker.gameAvailable(), "Game should not be ready with zero users queued");
            matchmaker.enqueue({name:"Cole",alive:true});
            assert(false === matchmaker.gameAvailable(),"Game should not be ready with one user queued");
        });
        it('Should be ready with two or more users',function(){
            var matchmaker = new Matchmaker([{name:"Cole",alive:true},{name:"Derek",alive:true}]);
            assert(true === matchmaker.gameAvailable(),"Game should be ready with two users");
            matchmaker.enqueue({name:"Paige"});
            assert(true === matchmaker.gameAvailable(),"Game should be ready with 2+ users");
        });
        it('Should not be ready if only one client in the queue is alive',function(){
            var matchmaker = new Matchmaker([]);
            matchmaker.enqueue({name:"Cole",alive:true});
            matchmaker.enqueue({name:"Derek",alive:false});
            matchmaker.enqueue({name:"Cole",alive:false});
            matchmaker.enqueue({name:"Derek",alive:false});
            assert(matchmaker.gameAvailable() === false,"Game should not be ready");
        });
    });

    it('Should clear the queue', function(){
        var matchmaker = new Matchmaker([{name:"one"},{name:"Two"}]);
        matchmaker.clearQueue();
        assert(matchmaker.clientQueue.length === 0, "Queue was not cleared out");

    });

    describe("Clean out queue",function(){
        it('Should remove dead users from the queue',function(){
            var matchmaker = new Matchmaker([]);
            var playerOne = {name:"Cole",alive:false};
            var playerTwo = {name:"Derek",alive:true};
            matchmaker.enqueue(playerOne);
            matchmaker.enqueue(playerTwo);
            matchmaker.cleanQueue();
            assert(matchmaker.clientQueue.length === 1, "Should clean out one client");
            assert(matchmaker.clientQueue.includes(playerOne) === false, "Should have removed client one");
        });
    });

    describe('Start new game',function(){
        it('Should create a new game with two players(with player one and two)',function(){
            var matchmaker = new Matchmaker([]);
            var playerOne = {name:"Cole",alive:true};
            var playerTwo = {name:"Derek",alive:true};
            matchmaker.enqueue(playerOne);
            matchmaker.enqueue(playerTwo);
            var game = matchmaker.createGame();
            assert(game.playerOne === playerOne, "player one should be player one in game");
            assert(game.playerTwo === playerTwo,"player two should be player two in game");
        });
        it('Should not start a game with a dead player', function(){
            var matchmaker = new Matchmaker([]);
            var playerOne = {name:"Cole",alive:true};
            var playerTwo = {name:"Derek",alive:false};
            matchmaker.enqueue(playerOne);
            matchmaker.enqueue(playerTwo);
            var game = matchmaker.createGame();
            assert(game === null, "Game should not start with dead player");
        });
        it('Should return null if a game cannot be started due to too few players', function(){
            var matchmaker = new Matchmaker([]);
            var playerOne = {name:"Cole",alive:true};
            matchmaker.enqueue(playerOne);
            var game = matchmaker.createGame();
            assert(game === null,"Game should not start with too few players");
        });
        it('Should remove two players upon starting a game', function(){
            var matchmaker = new Matchmaker([{name:"one",alive:true},{name:"one",alive:true},{name:"one",alive:true},{name:"one",alive:true}]);
            assert(matchmaker.clientQueue.length === 4, "Should have 4 players");
            var game = matchmaker.createGame();
            assert(game !== null,"Game should begin");
            assert(matchmaker.clientQueue.length === 2,"Should have removed two players from queue");
        });
        it('Should start a game with the two oldest clients with 2+ clients queued', function(){
            var matchmaker = new Matchmaker([]);
            var playerOne = {alive:true,name:"Cole"};
            var playerTwo = {alive:true,name:"Cole"};
            var playerThree = {alive:true,name:"Cole"};
            matchmaker.enqueue(playerOne);
            matchmaker.enqueue(playerTwo);
            matchmaker.enqueue(playerThree);
            var game = matchmaker.createGame();
            assert(game.playerOne === playerOne, "Should have used player one for game");
            assert(game.playerTwo === playerTwo, "Should have used player two for game");
        });
    });

    it('Should return the number of players queued',function(){
        var matchmaker = new Matchmaker([{name:"one",alive:true},{name:"Two",alive:true}]);
        assert.equal(matchmaker.clientCount(), 2,"Should have two queued clients");
    });

});
