import { Schema, type, ArraySchema } from '@colyseus/schema';
import { IBoardState, IPieceState, IPlayerState } from '../../../../typings/IBoardState';

class PieceState extends Schema implements IPieceState {
    @type('number')
    x: number = 0;
    
    @type('number')
    y: number = 0;
}

class PlayerState extends Schema implements IPlayerState {
    // @type('string')
    // id: string;
    
    @type([PieceState])
    piecesInYard: PieceState[];
    
    @type([PieceState])
    piecesOnBoard: PieceState[];
    
    constructor() {
        super();
        
        // this.id = id;
        this.piecesInYard = new ArraySchema();
        this.piecesOnBoard = new ArraySchema();
        
        for (let i = 0; i < 4; i++) {
            this.piecesInYard.push(new PieceState());
        }
    }
}

export class BoardState extends Schema implements IBoardState {
    @type([PlayerState])
    playerStates: PlayerState[];
    
    @type('number')
    lastDiceValue = 0;
    
    constructor() {
        super();
        
        this.playerStates = new ArraySchema();
        
        for (let i = 0; i < 4; i++) {
            this.playerStates.push(new PlayerState())
        }
    }
}
