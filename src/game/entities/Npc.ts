import Phaser from 'phaser';

export class Npc extends Phaser.GameObjects.Sprite {
  public npcId: string;

  constructor(scene: Phaser.Scene, x: number, y: number, npcId: string, texture = 'player_placeholder') {
    super(scene, x, y, texture);
    this.npcId = npcId;
    scene.add.existing(this);
  }
}
