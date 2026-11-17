import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  public speed = 160;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player_placeholder');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }
}
