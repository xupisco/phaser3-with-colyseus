import * as Colyseus from 'colyseus.js';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class SampleScene extends Phaser.Scene {
    private client: Colyseus.Client;
    
    constructor() {
        super(sceneConfig);
    }
    
    init() {
        this.client = new Colyseus.Client('ws://localhost:2567');
    }
    
    preload () {
        this.load.setBaseURL('https://labs.phaser.io');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    }
    
    async create() {
        const room = await this.client.joinOrCreate('my_room');
        const logo = this.physics.add.image(400, 100, 'logo');
        
        console.log(room.sessionId);
        
        room.onMessage('keydown', (message: string) => {
            console.log(message);
            logo.x += 10;
        })
        
        this.input.keyboard.on('keydown', (e: KeyboardEvent) => {
            room.send('keydown', e.key);
        })
    }
}
