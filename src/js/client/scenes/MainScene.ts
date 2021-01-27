import * as Colyseus from 'colyseus.js';
import { IBoardState } from '../../../typings/IBoardState';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

const pieceOffset = [
    { x: 200, y: 100 },
    { x: 150, y: 100 },
    { x: 200, y: 170 },
    { x: 150, y: 170 },
]

export class MainScene extends Phaser.Scene {
    private client: Colyseus.Client;
    
    constructor() {
        super(sceneConfig);
    }
    
    init() {
        this.client = new Colyseus.Client('ws://localhost:2567');
    }
    
    preload () {
        this.load.image('blue-piece', 'res/assets/pieces/piece-blue.png');
        this.load.image('red-piece', 'res/assets/pieces/piece-red.png');
        this.load.image('green-piece', 'res/assets/pieces/piece-green.png');
        this.load.image('yellow-piece', 'res/assets/pieces/piece-yellow.png');
    }
    
    async create() {
        const { width, height } = this.scale;
        const cx = width * 0.5;
        const cy = height * 0.5;
        const room = await this.client.joinOrCreate<IBoardState>('board');
        
        console.log(room.sessionId);
        
        room.onStateChange(state => {
            
            state.playerStates.forEach((playerState, idx) => {
                playerState.piecesInYard.forEach((piece, pidx) => {
                    const offset = pieceOffset[pidx];
                    switch (idx) {
                        case 0:
                            this.add.image(cx - offset.x, cy + offset.y, 'blue-piece');
                        case 1:
                            this.add.image(cx - offset.x, cy - offset.y, 'red-piece');
                        case 2:
                            this.add.image(cx + offset.x, cy - offset.y, 'green-piece');
                        case 3:
                            this.add.image(cx + offset.x, cy + offset.y, 'yellow-piece');
                            
                    }
                });
            });
        });
        
        room.onMessage('keydown', (message: string) => {
            console.log(message);
        })
        
        this.input.keyboard.on('keydown', (e: KeyboardEvent) => {
            room.send('keydown', e.key);
        })
    }
}
