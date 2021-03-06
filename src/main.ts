import * as Phaser from 'phaser';
import { SocketService } from './services/socket';
import { ChatMessage } from './types';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

function socketeering() {
  const sock = new SocketService();
  sock.init();
  window['sock'] = sock.socket;

  sock.on<ChatMessage>('message').subscribe((m: ChatMessage) => {
    console.log('[message]'+JSON.stringify(m))
  });
  sock.on('getdata').subscribe((b: any) => {
    console.log('[getdata]'+JSON.stringify(b))
  })
}

export class GameScene extends Phaser.Scene {
  private square: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };

  constructor() {
    super(sceneConfig);
  }

  public create() {
    this.square = this.add.rectangle(400, 400, 100, 100, 0xFFFFFF) as any;
    this.physics.add.existing(this.square);

    socketeering(); // experimental socket stuff
  }

  public update() {
    const cursorKeys = this.input.keyboard.createCursorKeys();

    if (cursorKeys.up.isDown) {
      this.square.body.setVelocityY(-500);
    } else if (cursorKeys.down.isDown) {
      this.square.body.setVelocityY(500);
    } else {
      this.square.body.setVelocityY(0);
    }

    if (cursorKeys.right.isDown) {
      this.square.body.setVelocityX(500);
    } else if (cursorKeys.left.isDown) {
      this.square.body.setVelocityX(-500);
    } else {
      this.square.body.setVelocityX(0);
    }
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Sample',

  type: Phaser.AUTO,

  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
  },

  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },

  parent: 'game',
  backgroundColor: '#000000',

  scene: GameScene,
};

export const game = new Phaser.Game(gameConfig);