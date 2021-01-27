import * as Colyseus from 'colyseus.js';
import StateMachine from '../../../shared/statemachine/StateMachine';
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
    private stateMachine!: StateMachine;
    
    constructor() {
        super(sceneConfig);
    }
    
    init() {
        this.client = new Colyseus.Client('ws://localhost:2567');
        
        this.stateMachine = new StateMachine(this, 'game');
        this.stateMachine.addState('idle')
            .addState('dice-roll', {
                onEnter: this.handleDiceRollEnter,
                onUpdate: this.handleDiceRollUpdate
            })
            .setState('idle');
    }
    
    preload () {
        this.load.image('blue-piece', 'res/assets/pieces/piece-blue.png');
        this.load.image('red-piece', 'res/assets/pieces/piece-red.png');
        this.load.image('green-piece', 'res/assets/pieces/piece-green.png');
        this.load.image('yellow-piece', 'res/assets/pieces/piece-yellow.png');
        
        for (let i = 1; i <= 6; ++i) {
            this.load.image(`dice-image-${i}`, `res/assets/dice/dieRed_border${i}.png`);
        }
    }
    
    async create() {
        const { width, height } = this.scale;
        const cx = width * 0.5;
        const cy = height * 0.5;
        const room = await this.client.joinOrCreate<IBoardState>('board');
        
        const dice = this.add.sprite(cx, cy, 'dice-image-6');
        
        console.log(room.sessionId);
        
        room.onStateChange.once(state => {
            this.handleInitialStatestate(state, cx, cy);
        });
        
        room.onMessage('keydown', (message: string) => {
            console.log(message);
        })
        
        this.input.keyboard.on('keyup-SPACE', (e: KeyboardEvent) => {
            this.stateMachine.setState('dice-roll');
            console.log(e);
        })
    }
    
    update(t: number, dt: number) {
        this.stateMachine.update(dt);
    }
    
    private handleDiceRollEnter() {
        console.log('Dice roll enter...');
    }
    
    private handleDiceRollUpdate(dt: number) {
        console.log('Dice roll update...');
    }
    
    private handleInitialStatestate(state: IBoardState, cx: number, cy: number) {
        state.playerStates.forEach((playerState, idx) => {
            playerState.piecesInYard.forEach((piece, pidx) => {
                const offset = pieceOffset[pidx];
                switch (idx) {
                    case 0:
                        this.add.image(cx - offset.x, cy + offset.y, 'blue-piece');
                        break;
                    case 1:
                        this.add.image(cx - offset.x, cy - offset.y, 'red-piece');
                        break;
                    case 2:
                        this.add.image(cx + offset.x, cy - offset.y, 'green-piece');
                        break;
                    case 3:
                        this.add.image(cx + offset.x, cy + offset.y, 'yellow-piece');
                        break;
                }
            });
        });
    }
}
