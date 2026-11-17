import Phaser from 'phaser';

export class VillageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VillageScene' });
  }

  create() {
    // Village background canvas with grass tone (#94CF7A)
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x94cf7a);

    // Subtle decorative grid / cobblestone placeholder
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x88c56f, 0.4);
    for (let x = 0; x < width; x += 40) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, height);
    }
    for (let y = 0; y < height; y += 40) {
      graphics.moveTo(0, y);
      graphics.lineTo(width, y);
    }
    graphics.strokePath();

    // Center spawn marker placeholder
    this.add.circle(width / 2, height / 2, 8, 0x4f8cff);
    this.add.text(width / 2, height / 2 + 16, 'Crossroads Spawn Point', {
      fontFamily: 'Inter, sans-serif',
      fontSize: '12px',
      color: '#3A2A1E',
    }).setOrigin(0.5);
  }
}
