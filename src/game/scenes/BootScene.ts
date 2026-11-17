import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Generate basic placeholder graphics or progress bars if needed
  }

  create() {
    this.scene.start('PreloadScene');
  }
}
