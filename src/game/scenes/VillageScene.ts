import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { PLACES, Place } from '../../data/places';
import { useGameStore } from '../../state/gameStore';
import { soundEffects } from '../systems/soundEffects';

interface AmbientParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  type: 'smoke' | 'leaf' | 'firefly' | 'ripple';
}

export class VillageScene extends Phaser.Scene {
  private player!: Player;
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;
  private zoneBoxes: { place: Place; bounds: Phaser.Geom.Rectangle }[] = [];
  private nearestPlace: Place | null = null;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private eKey!: Phaser.Input.Keyboard.Key;
  private promptContainer!: Phaser.GameObjects.Container;
  private promptText!: Phaser.GameObjects.Text;
  private promptBg!: Phaser.GameObjects.Rectangle;
  private arrowGraphic!: Phaser.GameObjects.Graphics;

  // Drag-to-pan / cursor slide state
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private isFollowActive = true;
  private fxGraphics!: Phaser.GameObjects.Graphics;
  private particles: AmbientParticle[] = [];

  constructor() {
    super({ key: 'VillageScene' });
  }

  create() {
    const worldWidth = 1440;
    const worldHeight = 900;

    // Set world and physics bounds
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    // 1. Ground: Lush grass base extending comfortably beyond bounds
    this.add.rectangle(worldWidth / 2, worldHeight / 2, worldWidth + 800, worldHeight + 600, 0x94cf7a);

    // Subtle grass patch variation
    const patches = this.add.graphics();
    patches.fillStyle(0x88c56f, 0.6);
    const patchPositions = [
      [180, 180, 80], [450, 120, 110], [900, 150, 90], [350, 680, 120],
      [840, 720, 100], [1200, 560, 90], [520, 480, 70], [80, 480, 60]
    ];
    patchPositions.forEach(([px, py, pr]) => {
      patches.fillCircle(px, py, pr);
    });

    // 2. Road Network (Cobblestone #EADFCB with border #BDAE92)
    this.drawRoadNetwork();

    // 3. Static Obstacles Group (Solid walls for collision)
    this.obstacles = this.physics.add.staticGroup();

    // 4. Place Buildings & Interactive Zones
    this.setupBuildingsAndZones();

    // 5. Spawn Player at Crossroads (700, 585)
    this.player = new Player(this, 700, 585);
    this.physics.add.collider(this.player, this.obstacles);

    // 6. Camera Setup: Lerp follow, clamped with generous pan margin
    const cam = this.cameras.main;
    cam.setBounds(-120, -90, worldWidth + 240, worldHeight + 180);
    cam.setZoom(1.05);
    cam.startFollow(this.player, true, 0.08, 0.08);
    this.isFollowActive = true;

    // 7. Input Controls: E and Enter for interaction
    if (this.input.keyboard) {
      this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    // 8. Drag-to-Pan (Cursor slide around village) & Click-to-Move
    this.setupCameraPanAndZoom();

    // 9. Floating Interaction Prompt & Arrow
    this.createInteractionUI();

    // 10. Ambient Visual Effects Graphics
    this.fxGraphics = this.add.graphics();
    this.fxGraphics.setDepth(9990);
    this.initAmbientParticles();

    // Listen for Walk Target from store (when pill label is clicked)
    useGameStore.subscribe((state) => {
      if (state.walkTarget) {
        this.player.setTarget(state.walkTarget.x, state.walkTarget.y);
        useGameStore.getState().setWalkTarget(null);
        this.recenterCamera();
      }
    });
  }

  private setupCameraPanAndZoom() {
    const cam = this.cameras.main;
    const canvas = this.game.canvas;
    canvas.style.cursor = 'grab';

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.isDragging = false;
      this.dragStartX = pointer.x;
      this.dragStartY = pointer.y;
      canvas.style.cursor = 'grabbing';
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown) return;

      const dx = pointer.x - this.dragStartX;
      const dy = pointer.y - this.dragStartY;

      // If dragged more than 6 pixels, enter drag-pan mode
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        this.isDragging = true;
        if (this.isFollowActive) {
          cam.stopFollow();
          this.isFollowActive = false;
        }

        cam.scrollX -= (pointer.x - pointer.prevPosition.x) / cam.zoom;
        cam.scrollY -= (pointer.y - pointer.prevPosition.y) / cam.zoom;

        // Clamp camera to world bounds with pan margin
        cam.scrollX = Phaser.Math.Clamp(cam.scrollX, -120, 1440 + 120 - cam.width / cam.zoom);
        cam.scrollY = Phaser.Math.Clamp(cam.scrollY, -90, 900 + 90 - cam.height / cam.zoom);
      }
    });

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      canvas.style.cursor = 'grab';

      // If not dragging, it's a tap/click-to-move
      if (!this.isDragging) {
        const worldX = pointer.worldX;
        const worldY = pointer.worldY;
        this.player.setTarget(worldX, worldY);
        this.recenterCamera();
      }
    });

    // Mouse wheel zoom
    this.input.on('wheel', (_pointer: Phaser.Input.Pointer, _gameObjects: unknown, _deltaX: number, deltaY: number) => {
      const newZoom = Phaser.Math.Clamp(cam.zoom - deltaY * 0.001, 0.8, 1.45);
      cam.setZoom(newZoom);
    });
  }

  private recenterCamera() {
    if (!this.isFollowActive) {
      this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
      this.isFollowActive = true;
    }
  }

  private drawRoadNetwork() {
    const road = this.add.graphics();
    road.fillStyle(0xeadfcb, 1);
    road.lineStyle(3, 0xbdae92, 1);

    const roads = [
      { x: 0, y: 496, w: 1440, h: 48 },
      { x: 676, y: 220, w: 48, h: 610 },
      { x: 184, y: 290, w: 48, h: 230 },
      { x: 1141, y: 250, w: 48, h: 270 },
      { x: 184, y: 520, w: 48, h: 280 },
      { x: 1036, y: 520, w: 48, h: 270 },
      { x: 700, y: 396, w: 700, h: 36 },
      { x: 540, y: 330, w: 180, h: 170 },
    ];

    roads.forEach((r) => {
      road.fillRect(r.x, r.y, r.w, r.h);
      road.strokeRect(r.x, r.y, r.w, r.h);
    });
  }

  private setupBuildingsAndZones() {
    const addBuildingObject = (
      textureKey: string,
      x: number,
      y: number,
      colliderW: number,
      colliderH: number,
      placeId?: string
    ) => {
      const img = this.add.image(x, y, textureKey);
      img.setOrigin(0, 0);
      img.setDepth(y + img.height - 10);

      const obs = this.obstacles.create(
        x + img.width / 2,
        y + img.height - colliderH / 2,
        undefined
      ) as Phaser.Physics.Arcade.Sprite;
      obs.setVisible(false);
      obs.setSize(colliderW, colliderH);
      obs.refreshBody();

      if (placeId) {
        const place = PLACES.find((p) => p.id === placeId);
        if (place) {
          const zoneBounds = new Phaser.Geom.Rectangle(
            place.doorPoint.x - 30,
            place.doorPoint.y - 30,
            60,
            60
          );
          this.zoneBoxes.push({ place, bounds: zoneBounds });
        }
      }
    };

    // Buildings
    addBuildingObject('bldg_home', 100, 90, 120, 60, 'home');
    addBuildingObject('bldg_library', 570, 50, 160, 65, 'library');
    addBuildingObject('bldg_tower', 1090, 20, 100, 70, 'cloud-tower');
    addBuildingObject('bldg_quantora', 770, 280, 80, 45, 'project-quantora');
    addBuildingObject('bldg_pramaan', 895, 280, 80, 45, 'project-pramaan');
    addBuildingObject('bldg_whytrace', 1020, 280, 80, 45, 'project-whytrace');
    addBuildingObject('bldg_data_engine', 1145, 280, 80, 45, 'project-data-engine');
    addBuildingObject('bldg_mini_vlm', 1270, 280, 80, 45, 'project-mini-vlm');
    addBuildingObject('bldg_college', 100, 610, 140, 65, 'college');
    addBuildingObject('bldg_post_office', 605, 655, 120, 50, 'post-office');
    addBuildingObject('bldg_workshop', 960, 640, 110, 50, 'workshop-sign');
    addBuildingObject('prop_notice_board', 400, 380, 50, 25, 'notice-board');
    addBuildingObject('prop_guestbook', 580, 330, 40, 25, 'guestbook-stand');

    // Pond
    const pondImg = this.add.image(1290, 720, 'prop_pond');
    pondImg.setOrigin(0.5, 0.5);
    pondImg.setDepth(720);
    const pondObs = this.obstacles.create(1290, 720, undefined) as Phaser.Physics.Arcade.Sprite;
    pondObs.setVisible(false);
    pondObs.setSize(100, 70);
    pondObs.refreshBody();

    // Street Lamps
    [[651, 448], [751, 448], [651, 600], [751, 600]].forEach(([lx, ly]) => {
      const lamp = this.add.image(lx, ly, 'prop_lamp');
      lamp.setOrigin(0.5, 0.9);
      lamp.setDepth(ly);
    });

    // Trees
    const treeLocs = [
      [50, 40], [320, 60], [440, 80], [820, 40], [980, 40],
      [40, 380], [40, 520], [40, 820], [420, 820], [840, 830],
      [1380, 160], [1390, 480], [1390, 820]
    ];
    treeLocs.forEach(([tx, ty], i) => {
      const key = i % 4 === 0 ? 'prop_tree_autumn' : 'prop_tree_green';
      const tree = this.add.image(tx, ty, key);
      tree.setOrigin(0.5, 0.9);
      tree.setDepth(ty);
      const trunk = this.obstacles.create(tx, ty, undefined) as Phaser.Physics.Arcade.Sprite;
      trunk.setVisible(false);
      trunk.setSize(20, 14);
      trunk.refreshBody();
    });

    // NPCs
    // 1. Tanish AI Companion in Town Square
    const aiNpc = this.add.image(685, 390, 'npc_tanish_ai');
    aiNpc.setOrigin(0.5, 0.9);
    aiNpc.setDepth(390);
    const aiPlace = PLACES.find((p) => p.id === 'tanish-ai-npc');
    if (aiPlace) {
      this.zoneBoxes.push({
        place: aiPlace,
        bounds: new Phaser.Geom.Rectangle(685 - 30, 390 - 30, 60, 60),
      });
    }

    // 2. Librarian near Library
    const libNpc = this.add.image(640, 220, 'npc_librarian');
    libNpc.setOrigin(0.5, 0.9);
    libNpc.setDepth(220);

    // 3. Postmaster near Post Office
    const postNpc = this.add.image(760, 760, 'npc_postmaster');
    postNpc.setOrigin(0.5, 0.9);
    postNpc.setDepth(760);

    // 4. Interactive World-Space Badges for all Buildings (Locked to world coordinates)
    this.createPlaceBadges();
  }

  private createPlaceBadges() {
    PLACES.forEach((place) => {
      let badgeX = place.zone.x + place.zone.width / 2;
      let badgeY = place.zone.y - 14;

      // Stagger project street badges so they have ample breathing room without overlapping
      if (place.id === 'project-pramaan' || place.id === 'project-data-engine') {
        badgeY = place.zone.y - 32;
      } else if (place.id.startsWith('project-')) {
        badgeY = place.zone.y - 12;
      } else if (place.id === 'tanish-ai-npc') {
        badgeX = 685;
        badgeY = 340;
      } else if (place.id === 'guestbook-stand') {
        badgeX = 610;
        badgeY = 312;
      } else if (place.id === 'cloud-tower') {
        badgeY = place.zone.y - 4;
      } else if (place.id === 'library') {
        badgeY = place.zone.y - 18;
      }

      const container = this.add.container(badgeX, badgeY);
      container.setDepth(2600);

      // Label text
      const text = this.add.text(0, 0, place.label, {
        fontFamily: 'Fredoka, Nunito, system-ui, sans-serif',
        fontSize: '11px',
        color: '#3A2A1E',
        fontStyle: 'bold',
      });
      text.setOrigin(0, 0.5);

      const textW = text.width;
      const badgeW = Math.max(textW + 36, 85);
      const badgeH = 26;

      // Position text with padding for colored indicator dot
      text.setX(-badgeW / 2 + 22);

      // Pill background
      const bg = this.add.graphics();
      const drawBg = (hover = false) => {
        bg.clear();
        // 3D bottom drop shadow
        bg.fillStyle(0x3a2a1e, 0.9);
        bg.fillRoundedRect(-badgeW / 2, -badgeH / 2 + 3, badgeW, badgeH, 13);
        // Pill fill
        bg.fillStyle(hover ? 0xffffff : 0xfff6e3, 1);
        bg.fillRoundedRect(-badgeW / 2, -badgeH / 2, badgeW, badgeH, 13);
        // Ink outline
        bg.lineStyle(2, 0x3a2a1e, 1);
        bg.strokeRoundedRect(-badgeW / 2, -badgeH / 2, badgeW, badgeH, 13);
      };
      drawBg(false);

      // Colored roof indicator dot
      const dot = this.add.graphics();
      const colorInt = parseInt((place.roofColor || '#F6B73C').replace('#', '0x'), 16);
      dot.fillStyle(colorInt, 1);
      dot.fillCircle(-badgeW / 2 + 11, 0, 4.5);
      dot.lineStyle(1.5, 0x3a2a1e, 0.8);
      dot.strokeCircle(-badgeW / 2 + 11, 0, 4.5);

      container.add([bg, dot, text]);
      container.setSize(badgeW, badgeH);
      container.setInteractive({ useHandCursor: true });

      let pointerDownX = 0;
      let pointerDownY = 0;

      container.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        pointerDownX = pointer.x;
        pointerDownY = pointer.y;
      });

      container.on('pointerover', () => {
        drawBg(true);
        this.tweens.add({
          targets: container,
          scale: 1.07,
          duration: 100,
          ease: 'Sine.easeOut',
        });
      });

      container.on('pointerout', () => {
        drawBg(false);
        this.tweens.add({
          targets: container,
          scale: 1.0,
          duration: 100,
          ease: 'Sine.easeOut',
        });
      });

      container.on('pointerup', (pointer: Phaser.Input.Pointer) => {
        const dist = Phaser.Math.Distance.Between(pointerDownX, pointerDownY, pointer.x, pointer.y);
        // Trigger only if user clicked/tapped (not dragged to pan)
        if (dist < 8 && !this.isDragging) {
          soundEffects.playClick();
          useGameStore.getState().markVisited(place.id);
          if (place.panel) {
            useGameStore.getState().openPanel(place.panel, place.projectId);
          } else if (place.externalUrl) {
            window.open(place.externalUrl, '_blank', 'noopener,noreferrer');
          }
        }
      });
    });
  }

  private initAmbientParticles() {
    // 1. Chimney smoke particles
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: 202 + (Math.random() - 0.5) * 6,
        y: 80 - i * 12,
        vx: 0.15 + Math.random() * 0.1,
        vy: -0.4 - Math.random() * 0.2,
        alpha: 0.6 - i * 0.08,
        size: 5 + i * 2,
        type: 'smoke',
      });
    }

    // 2. Drifting leaves
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: Math.random() * 1440,
        y: Math.random() * 900,
        vx: 0.6 + Math.random() * 0.4,
        vy: 0.3 + Math.random() * 0.2,
        alpha: 0.7,
        size: 4,
        type: 'leaf',
      });
    }

    // 3. Fireflies / evening glow
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x: 600 + Math.random() * 200,
        y: 400 + Math.random() * 220,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: 0.8,
        size: 3,
        type: 'firefly',
      });
    }
  }

  private updateAmbientParticles() {
    const isEvening = useGameStore.getState().season === 'evening';
    this.fxGraphics.clear();

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.type === 'smoke') {
        p.alpha -= 0.003;
        p.size += 0.02;
        if (p.alpha <= 0.05) {
          p.x = 202 + (Math.random() - 0.5) * 6;
          p.y = 80;
          p.alpha = 0.6;
          p.size = 5;
        }
        this.fxGraphics.fillStyle(0xffffff, p.alpha * 0.5);
        this.fxGraphics.fillCircle(p.x, p.y, p.size);
      } else if (p.type === 'leaf') {
        if (p.x > 1440 || p.y > 900) {
          p.x = Math.random() * 400;
          p.y = Math.random() * 200;
        }
        this.fxGraphics.fillStyle(0xe8a640, 0.7);
        this.fxGraphics.fillEllipse(p.x, p.y, p.size * 1.5, p.size);
      } else if (p.type === 'firefly' && isEvening) {
        p.vx += (Math.random() - 0.5) * 0.05;
        p.vy += (Math.random() - 0.5) * 0.05;
        const pulse = 0.5 + Math.sin(this.time.now / 300) * 0.4;
        this.fxGraphics.fillStyle(0xf6b73c, pulse);
        this.fxGraphics.fillCircle(p.x, p.y, p.size);
      }
    }

    // Animated pond water ripples
    const rippleRadius = 20 + Math.sin(this.time.now / 600) * 10;
    this.fxGraphics.lineStyle(1.5, 0xffffff, 0.35);
    this.fxGraphics.strokeEllipse(1290, 720, rippleRadius * 2, rippleRadius * 1.2);
  }

  private createInteractionUI() {
    this.promptContainer = this.add.container(0, 0);
    this.promptContainer.setDepth(9999);
    this.promptContainer.setVisible(false);

    this.promptBg = this.add.rectangle(0, 0, 230, 36, 0xfff6e3);
    this.promptBg.setStrokeStyle(2, 0x3a2a1e);
    this.promptText = this.add.text(0, 0, 'Press E to Enter', {
      fontFamily: 'Inter, sans-serif',
      fontSize: '12px',
      color: '#3A2A1E',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.promptContainer.add([this.promptBg, this.promptText]);

    this.arrowGraphic = this.add.graphics();
    this.arrowGraphic.setDepth(9998);
    this.arrowGraphic.fillStyle(0xf6b73c, 1);
    this.arrowGraphic.lineStyle(2, 0x3a2a1e, 1);
    this.arrowGraphic.beginPath();
    this.arrowGraphic.moveTo(-8, -16);
    this.arrowGraphic.lineTo(8, -16);
    this.arrowGraphic.lineTo(0, 0);
    this.arrowGraphic.closePath();
    this.arrowGraphic.fillPath();
    this.arrowGraphic.strokePath();
    this.arrowGraphic.setVisible(false);
  }

  update() {
    this.player.update();
    this.updateAmbientParticles();

    // Re-center follow on player movement
    if (this.player.body && (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0)) {
      this.recenterCamera();
    }

    // Check distance to interactive zones
    let currentNearby: Place | null = null;
    const playerFeet = new Phaser.Math.Vector2(this.player.x, this.player.y + 16);

    for (const zb of this.zoneBoxes) {
      if (zb.bounds.contains(playerFeet.x, playerFeet.y)) {
        currentNearby = zb.place;
        break;
      }
    }

    if (this.nearestPlace !== currentNearby) {
      this.nearestPlace = currentNearby;
      useGameStore.getState().setCurrentZone(currentNearby);
    }

    if (currentNearby) {
      this.promptContainer.setPosition(this.player.x, this.player.y - 40);
      this.promptText.setText(`Press E · Enter ${currentNearby.name}`);
      this.promptContainer.setVisible(true);

      const bobY = Math.sin(this.time.now / 150) * 4;
      this.arrowGraphic.setPosition(currentNearby.doorPoint.x, currentNearby.doorPoint.y - 20 + bobY);
      this.arrowGraphic.setVisible(true);

      const justE = Phaser.Input.Keyboard.JustDown(this.eKey);
      const justEnter = Phaser.Input.Keyboard.JustDown(this.enterKey);

      if (justE || justEnter) {
        soundEffects.playEnter();
        useGameStore.getState().markVisited(currentNearby.id);
        if (currentNearby.panel) {
          useGameStore.getState().openPanel(currentNearby.panel, currentNearby.projectId);
        }
      }
    } else {
      this.promptContainer.setVisible(false);
      this.arrowGraphic.setVisible(false);
    }
  }
}
