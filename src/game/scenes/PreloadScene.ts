import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Generate simple placeholder textures programmatically for Phase 1
    const playerGraphics = this.make.graphics({ x: 0, y: 0 });
    playerGraphics.fillStyle(0x3a2a1e, 1);
    playerGraphics.fillRoundedRect(0, 0, 24, 32, 6);
    playerGraphics.fillStyle(0x4f8cff, 1);
    playerGraphics.fillRoundedRect(2, 2, 20, 28, 4);
    playerGraphics.generateTexture('player_placeholder', 24, 32);
    playerGraphics.destroy();
  }

  create() {
    this.scene.start('VillageScene');
  }
}
