const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class SampleScene extends Phaser.Scene {
    constructor() {
        super(sceneConfig);
    }
    
    public preload () {
        this.load.setBaseURL('https://labs.phaser.io');

        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/red.png');
    }
    
    public create() {
        let particles = this.add.particles('red');

        let emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'SCREEN'
        });

        let logo = this.physics.add.image(400, 100, 'logo');

        logo.setVelocity(510, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        emitter.startFollow(logo);
    }
}
