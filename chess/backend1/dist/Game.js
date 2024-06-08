"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const message_1 = require("./message");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        //validation
        //is it this users move 
        if (this.board.moves.length % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.board.moves.length % 2 === 1 && socket !== this.player2) {
            return;
        }
        // is move valid by lib!
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log(e);
            return;
        }
        //update move 
        //push move
        //check if game is over
        if (this.board.isGameOver()) {
            //send messages to both thr players 
            this.player1.emit(JSON.stringify({
                type: message_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }
        if (this.board.moves.length % 2 === 0) {
            this.player2.emit(JSON.stringify({
                type: message_1.MOVE,
                payload: move
            }));
        }
        //send updated board to both users
    }
}
exports.Game = Game;
