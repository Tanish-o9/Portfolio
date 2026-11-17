import Phaser from 'phaser';
import { useGameStore } from '../../state/gameStore';
import { soundEffects } from '../systems/soundEffects';

export class Player extends Phaser.Physics.Arcade.Sprite {
  public speed = 190;
  private shadow: Phaser.GameObjects.Image;
  private petSprite: Phaser.GameObjects.Image;
  private targetPoint: Phaser.Math.Vector2 | null = null;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private shiftKey?: Phaser.Input.Keyboard.Key;
  private lastDustTime = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player_front');

    // Add shadow image under player
    this.shadow = scene.add.image(x, y + 20, 'shadow_blob');
    this.shadow.setOrigin(0.5, 0.5);

    // Companion pet sprite (Drone or Cat)
    this.petSprite = scene.add.image(x - 22, y + 4, 'pet_drone');
    this.petSprite.setOrigin(0.5, 0.5);

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
      this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
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

    // Sprinting mechanics (Hold Shift to sprint at 280 speed)
    const isSprinting = this.shiftKey?.isDown ?? false;
    const currentSpeed = isSprinting ? 270 : 190;
    this.setVelocity(vx * currentSpeed, vy * currentSpeed);

    // Directional textures
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

    const isMoving = vx !== 0 || vy !== 0;

    // Juicy Walk Animation: Squash & Stretch + Bounce
    if (isMoving) {
      const bounceFreq = isSprinting ? 65 : 85;
      const walkPhase = Math.sin(this.scene.time.now / bounceFreq);

      // Squash and stretch
      this.scaleY = 1 + walkPhase * 0.12;
      this.scaleX = (this.flipX ? -1 : 1) * (1 - walkPhase * 0.08);
      this.angle = walkPhase * (isSprinting ? 8 : 4.5);

      // Dynamic shadow scale following jump
      this.shadow.setScale(1 - walkPhase * 0.12, 1 - walkPhase * 0.12);

      // Kick up dust particles
      const now = Date.now();
      if (now - this.lastDustTime > (isSprinting ? 120 : 180)) {
        this.lastDustTime = now;
        const vs = this.scene as unknown as { addDustParticle?: (x: number, y: number) => void };
        if (vs.addDustParticle) {
          vs.addDustParticle(this.x + (Math.random() - 0.5) * 8, this.y + 18);
        }
      }

      soundEffects.playFootstep();
    } else {
      // Idle Breathing Cycle
      const breathe = Math.sin(this.scene.time.now / 380) * 0.04;
      this.scaleY = 1 + breathe;
      this.scaleX = (this.flipX ? -1 : 1) * (1 - breathe * 0.6);
      this.angle = 0;
      this.shadow.setScale(1, 1);
    }

    // Keep shadow glued to feet
    this.shadow.setPosition(this.x, this.y + 20);
    this.shadow.setDepth(this.y - 1);

    // Companion pet logic & banking physics
    const { pet, hoodieColor } = useGameStore.getState();
    if (pet === 'none') {
      this.petSprite.setVisible(false);
    } else {
      this.petSprite.setVisible(true);
      const textureKey = pet === 'cat' ? 'pet_cat' : 'pet_drone';
      if (this.petSprite.texture.key !== textureKey) {
        this.petSprite.setTexture(textureKey);
      }

      const targetPetX = this.flipX ? this.x + 24 : this.x - 24;
      const bob = pet === 'drone' ? Math.sin(this.scene.time.now / 160) * 5 : (isMoving ? Math.sin(this.scene.time.now / 80) * 2 : 0);
      const targetPetY = this.y + (pet === 'drone' ? -8 : 12) + bob;

      this.petSprite.x += (targetPetX - this.petSprite.x) * 0.16;
      this.petSprite.y += (targetPetY - this.petSprite.y) * 0.16;
      this.petSprite.setDepth(this.y + 2);
      this.petSprite.setFlipX(this.flipX);

      // Bank into turn
      this.petSprite.angle = vx * (pet === 'drone' ? 15 : 6);
    }

    // Custom hoodie color tint
    if (hoodieColor && hoodieColor !== '#4F8CFF') {
      const tintInt = parseInt(hoodieColor.replace('#', '0x'), 16);
      this.setTint(tintInt);
    } else {
      this.clearTint();
    }

    // Y-sorting depth
    this.setDepth(this.y);
  }
}
