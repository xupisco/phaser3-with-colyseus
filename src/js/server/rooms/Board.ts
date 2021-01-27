import { Room, Client } from "colyseus";
import { BoardState } from "./schema/BoardState";

export class Board extends Room {
    onCreate (options: any) {
        this.setState(new BoardState());
        
        this.onMessage('keydown', (client, message) => {
            this.broadcast('keydown', message, {
                except: client
            })
        });
    }
    
    onJoin (client: Client, options: any) {
    }
    
    onLeave (client: Client, consented: boolean) {
    }
    
    onDispose() {
    }
    
}
