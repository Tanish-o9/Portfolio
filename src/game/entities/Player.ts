import Phaser from 'phaser';
import { useGameStore } from '../../state/gameStore';
import { soundEffects } from '../systems/soundEffects';

export class Player extends Phaser.Physics.Arcade.Sprite {
  public speed = 190;
  private shadow: Phaser.GameObjects.Image;
  private targetPoint: Phaser.Math.Vector2 | null = null;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player_front');

    // Add shadow image under player
    this.shadow = scene.add.image(x, y + 20, 'shadow_blob');
    this.shadow.setOrigin(0.5, 0.5);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Collide with world bounds (1440x900)
    this.setCollideWorldBounds(true);

    // Hitbox centered on feet for depth sorting
    this.body?.setSize(20, 16);
    this.body?.setOffset(4, 28);

    // Setup keyboard inputs
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.wasdKeys = scene.input.keyboard.addKeys('W,A,S,D') as typeof this.wasdKeys;
    }
  }

  public setTarget(x: number, y: number): void {
    this.targetPoint = new Phaser.Math.Vector2(x, y);
  }

  public clearTarget(): void {
    this.targetPoint = null;
  }

  public update(): void {
    const isPaused = useGameStore.getState().activePanel !== null;
    if (isPaused) {
      this.setVelocity(0, 0);
      return;
    }

    let vx = 0;
    let vy = 0;

    const left = this.cursors?.left.isDown || this.wasdKeys?.A.isDown;
    const right = this.cursors?.right.isDown || this.wasdKeys?.D.isDown;
    const up = this.cursors?.up.isDown || this.wasdKeys?.W.isDown;
    const down = this.cursors?.down.isDown || this.wasdKeys?.S.isDown;

    if (left || right || up || down) {
      // Manual keyboard input cancels click-to-move target
      this.targetPoint = null;

      if (left) vx -= 1;
      if (right) vx += 1;
      if (up) vy -= 1;
      if (down) vy += 1;
    } else if (this.targetPoint) {
      // Tap / Click-to-move navigation
      const dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetPoint.x, this.targetPoint.y);
      if (dist < 6) {
        this.targetPoint = null;
      } else {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.targetPoint.x, this.targetPoint.y);
        vx = Math.cos(angle);
        vy = Math.sin(angle);
      }
    }

    // Normalize diagonal velocity
    if (vx !== 0 && vy !== 0) {
      const invMag = 1 / Math.SQRT2;
      vx *= invMag;
      vy *= invMag;
    }

    this.setVelocity(vx * this.speed, vy * this.speed);

    // Directional textures and visual tilt
    if (vy < 0) {
      this.setTexture('player_back');
      this.setFlipX(false);
    } else if (vy > 0) {
      this.setTexture('player_front');
      this.setFlipX(false);
    } else if (vx < 0) {
      this.setTexture('player_side');
      this.setFlipX(true);
    } else if (vx > 0) {
      this.setTexture('player_side');
      this.setFlipX(false);
    }

    // Walking animation wobble & footstep sound
    if (vx !== 0 || vy !== 0) {
      this.angle = Math.sin(this.scene.time.now / 100) * 4;
      soundEffects.playFootstep();
    } else {
      this.angle = 0;
    }

    // Keep shadow glued to feet
    this.shadow.setPosition(this.x, this.y + 20);
    this.shadow.setDepth(this.y - 1);

    // Y-sorting depth
    this.setDepth(this.y);
  }
}
