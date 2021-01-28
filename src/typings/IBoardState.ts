import { Schema } from '@colyseus/schema';

export interface IPieceState extends Schema {
    x: number;
    y: number;
}

export interface IPlayerState extends Schema {
    piecesInYard: IPieceState[];
    piecesOnBoard: IPieceState[];
}

export interface IBoardState extends Schema {
    playerStates: IPlayerState[];
    lastDiceValue: number;
}
