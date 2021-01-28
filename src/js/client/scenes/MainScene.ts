import * as Colyseus from 'colyseus.js';
import StateMachine from '../../../shared/statemachine/StateMachine';
import { ClientMessage } from '../../../typings/ClientMessage';
import { IBoardState } from '../../../typings/IBoardState';
import { ServerMessage } from '../../../typings/ServerMessage';

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
    
    private room!: Colyseus.Room<IBoardState>;
    private dice!: Phaser.GameObjects.Sprite;
    private diceRollAnimationAccumulator: number = 0;
    
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
            .addState('dice-roll-finish', {
                onEnter: this.handleDiceRollFinishEnter
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
        
        this.room = await this.client.joinOrCreate<IBoardState>('board');
        this.dice = this.add.sprite(cx, cy, 'dice-image-6');
        
        console.log(this.room.sessionId);
        
        this.room.onStateChange.once(state => {
            this.handleInitialStatestate(state, cx, cy);
        });
        
        this.room.onMessage('keydown', (message: string) => {
            console.log(message);
        })
        
        this.input.keyboard.on('keyup-SPACE', (e: KeyboardEvent) => {
            this.stateMachine.setState('dice-roll');
            //console.log(e);
        })
    }
    
    update(t: number, dt: number) {
        this.stateMachine.update(dt);
    }
    
    private handleDiceRollEnter() {
        // Send message to server
        this.room.send(ClientMessage.DiceRoll);
        
        const value = Phaser.Math.Between(1, 6);
        this.dice.setTexture(`dice-image-${value}`);
        this.diceRollAnimationAccumulator = 0;
        
        // Await response
        this.room.state.onChange = (changes => {
            changes.forEach(change => {
                if (change.field !== 'lastDiceValue') {
                    return;
                }
                
                this.room.state.onChange = undefined;
                this.time.delayedCall(1000, () =>
                    this.stateMachine.setState('dice-roll-finish')
                );
            })
        })
        
        //this.room.onMessage(ServerMessage.DiceRollResult, diceValue => {
        //    this.dice.setTexture(`dice-image-${diceValue}`);
        //})
    }
    
    private handleDiceRollUpdate(dt: number) {
        this.diceRollAnimationAccumulator += dt;
        if (this.diceRollAnimationAccumulator >= 150) {
            const value = Phaser.Math.Between(1, 6);
            this.dice.setTexture(`dice-image-${value}`);
            
            this.diceRollAnimationAccumulator = 0;
        }
    }
    
    private handleDiceRollFinishEnter() {
        this.dice.setTexture(`dice-image-${this.room.state.lastDiceValue}`);
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
