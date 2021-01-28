import randomInt from "../../../shared/math/random";
import { Room, Client } from "colyseus";
import { ClientMessage } from "../../../typings/ClientMessage";
import { ServerMessage } from "../../../typings/ServerMessage";
import { BoardState } from "./schema/BoardState";

export class Board extends Room<BoardState> {
    onCreate (options: any) {
        this.setState(new BoardState());
        
        this.onMessage('keydown', (client, message) => {
            this.broadcast('keydown', message, {
                except: client
            })
        });
        
        this.onMessage(ClientMessage.DiceRoll, (client, message) => {
            const value = randomInt(1, 7);
            this.state.lastDiceValue = value;
        });
    }
    
    onJoin (client: Client, options: any) {
    }
    
    onLeave (client: Client, consented: boolean) {
    }
    
    onDispose() {
    }
    
}
