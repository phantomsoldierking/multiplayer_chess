import { WebSocket } from "ws";
import { Chess } from "chess.js"
import { GAME_OVER, INIT_GAME, MOVE } from "./message";

export class Game {

    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    private startTime:Date;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }))
    }

    makeMove(socket: WebSocket, move: {from: string, to:string} ){
        //validation
        //is it this users move 
        if(this.board.moves.length % 2 === 0 && socket !== this.player1) {
            return;
        }
        if(this.board.moves.length % 2 === 1 && socket !== this.player2) {
            return;
        }
        // is move valid by lib!
        try {
            this.board.move(move);
        } catch (e) {
            console.log(e);
            return;
        }

        //update move 
        //push move

        //check if game is over
        if(this.board.isGameOver()) {
            //send messages to both thr players 
            this.player1.emit(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }))
            return;
        }

        if(this.board.moves.length % 2 === 0) {
            this.player2.emit(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }
        
        //send updated board to both users
    }


}