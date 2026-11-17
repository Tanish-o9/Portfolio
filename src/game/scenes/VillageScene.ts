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
  private arrowGraphic!: Phaser.GameObjects.Graphics;

  // Animated world systems
  private trees: Phaser.GameObjects.Image[] = [];
  private npcs: Phaser.GameObjects.Image[] = [];
  private badgeContainers: Array<{ container: Phaser.GameObjects.Container; baseY: number; phase: number }> = [];
  private koiFish: Array<{ sprite: Phaser.GameObjects.Image; angle: number; speed: number; radiusX: number; radiusY: number }> = [];
  private birds: Array<{ x: number; y: number; vx: number; vy: number; wingPhase: number }> = [];
  private npcBubbles: Map<string, { container: Phaser.GameObjects.Container; targetX: number; targetY: number; visible: boolean }> = new Map();
  private dustPuffs: Array<{ x: number; y: number; vx: number; vy: number; alpha: number; size: number }> = [];
  private sparkles: Array<{ x: number; y: number; vx: number; vy: number; alpha: number; color: number; size: number }> = [];

  // Drag-to-pan / cursor slide state
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private isFollowActive = true;
  private fxGraphics!: Phaser.GameObjects.Graphics;
  private particles: AmbientParticle[] = [];

  public addDustParticle(x: number, y: number) {
    if (this.dustPuffs.length < 25) {
      this.dustPuffs.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.3,
        alpha: 0.55,
        size: 3.5,
      });
    }
  }

  public spawnSparkles(x: number, y: number, color = 0xf6b73c) {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.3;
      const spd = 1.2 + Math.random() * 1.8;
      this.sparkles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        alpha: 1,
        color,
        size: 3 + Math.random() * 2,
      });
    }
  }

  constructor() {
    super({ key: 'VillageScene' });
  }

  create() {
    const worldWidth = 1440;
    const worldHeight = 900;

    // Set world and physics bounds
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    // 1. Ground: Lush warm meadow grass base extending seamlessly across any screen
    this.add.rectangle(worldWidth / 2, worldHeight / 2, 4400, 3200, 0x8ac46e);

    // Subtle meadow rolling hills variation
    const patches = this.add.graphics();
    patches.fillStyle(0x7ebc61, 0.45);
    const patchPositions = [
      [180, 180, 110], [450, 120, 130], [900, 150, 110], [350, 680, 140],
      [840, 720, 120], [1200, 560, 110], [520, 480, 95], [80, 480, 85],
      [1350, 320, 100], [280, 340, 90], [1050, 160, 110], [640, 820, 120]
    ];
    patchPositions.forEach(([px, py, pr]) => {
      patches.fillCircle(px, py, pr);
    });

    // Sunlit warm grass patches
    patches.fillStyle(0x9bd47c, 0.35);
    [
      [220, 140, 65], [600, 110, 75], [960, 180, 60], [400, 710, 80],
      [800, 690, 70], [1160, 520, 65], [710, 360, 55], [130, 450, 50]
    ].forEach(([sx, sy, sr]) => {
      patches.fillCircle(sx, sy, sr);
    });

    // Delicate scattered wildflower & clover meadow specks
    const flowers = this.add.graphics();
    flowers.fillStyle(0xfffdf7, 0.85); // White daisies
    const daisyCoords = [
      [120, 260], [290, 160], [380, 90], [490, 220], [840, 110], [1010, 90],
      [70, 680], [260, 690], [330, 810], [520, 760], [820, 860], [930, 800],
      [1240, 490], [1370, 390], [1330, 600], [1390, 690], [70, 340], [160, 430]
    ];
    daisyCoords.forEach(([fx, fy]) => {
      flowers.fillCircle(fx, fy, 2);
      flowers.fillCircle(fx + 2.5, fy + 1, 1.5);
    });

    flowers.fillStyle(0xfde047, 0.9); // Buttercup yellow centers
    daisyCoords.forEach(([fx, fy]) => {
      flowers.fillCircle(fx + 1, fy, 1);
    });

    // 2. Road Network (Warm Cobblestone #EDE4D4 with border #BBA88C)
    this.drawRoadNetwork();

    // 3. Static Obstacles Group (Solid walls for collision)
    this.obstacles = this.physics.add.staticGroup();

    // 4. Place Buildings & Interactive Zones
    this.setupBuildingsAndZones();

    // 5. Spawn Player at Crossroads (700, 585)
    this.player = new Player(this, 700, 585);
    this.physics.add.collider(this.player, this.obstacles);

    // 6. Camera Setup: Lerp follow, clamped with generous pan margin & responsive full-screen scaling
    const cam = this.cameras.main;
    cam.setBackgroundColor('#8AC46E');
    cam.setBounds(-400, -300, worldWidth + 800, worldHeight + 600);

    const updateResponsiveZoom = () => {
      const w = this.scale.width;
      let targetZoom = 1.05;
      if (w < 640) {
        // Mobile portrait: scale comfortably so village is fully visible without cramped sides
        targetZoom = Math.max(0.68, Math.min(0.85, w / 540));
      } else if (w < 1024) {
        targetZoom = 0.92;
      } else {
        targetZoom = 1.05;
      }
      cam.setZoom(targetZoom);
    };
    updateResponsiveZoom();
    this.scale.on('resize', updateResponsiveZoom);

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

        // Clamp camera to world bounds with generous pan margin
        const minX = -350;
        const maxX = Math.max(minX, 1440 + 350 - cam.width / cam.zoom);
        cam.scrollX = Phaser.Math.Clamp(cam.scrollX, minX, maxX);

        const minY = -250;
        const maxY = Math.max(minY, 900 + 250 - cam.height / cam.zoom);
        cam.scrollY = Phaser.Math.Clamp(cam.scrollY, minY, maxY);
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
    road.fillStyle(0xede4d4, 1);
    road.lineStyle(3, 0xbba88c, 1);

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

    // Town Square Decorative Plaza Ring around Central Fountain
    road.fillStyle(0xe2d4bd, 1);
    road.fillCircle(630, 420, 52);
    road.lineStyle(2.5, 0xbba88c, 0.9);
    road.strokeCircle(630, 420, 52);
    road.strokeCircle(630, 420, 36);

    // Stepping Stones connecting Roads to Building Doorsteps
    road.fillStyle(0xede4d4, 1);
    road.lineStyle(2, 0xbba88c, 0.95);

    const steppingStones = [
      // To Home Door (170, 228) -> (184, 290)
      [176, 245, 16, 12], [180, 265, 18, 14],
      // To Library Door (660, 198) -> (676, 220)
      [668, 206, 18, 12],
      // To Cloud Tower Door (1150, 208) -> (1141, 250)
      [1148, 222, 18, 12], [1146, 238, 18, 12],
      // To College Door (180, 748) -> (184, 520)
      [180, 730, 18, 14], [182, 705, 18, 14], [184, 680, 18, 14],
      // To Post Office Door (675, 772) -> (676, 800)
      [675, 786, 18, 12],
      // To Workshop Door (1025, 758) -> (1036, 520)
      [1028, 735, 18, 14], [1032, 710, 18, 14], [1034, 680, 18, 14],
      // Project Street Doorsteps
      [815, 388, 16, 9], [940, 388, 16, 9], [1065, 388, 16, 9], [1190, 388, 16, 9], [1315, 388, 16, 9],
    ];

    steppingStones.forEach(([sx, sy, sw, sh]) => {
      road.fillRoundedRect(sx - sw / 2, sy - sh / 2, sw, sh, 5);
      road.strokeRoundedRect(sx - sw / 2, sy - sh / 2, sw, sh, 5);
    });

    // Welcome Doormats at each Building Entrance
    PLACES.forEach((p) => {
      if (p.id === 'tanish-ai-npc' || p.id === 'guestbook-stand' || p.id === 'notice-board') return;
      const matColor = parseInt(p.roofColor.replace('#', '0x'), 16);
      road.fillStyle(matColor, 0.95);
      road.fillRoundedRect(p.doorPoint.x - 14, p.doorPoint.y - 5, 28, 10, 3);
      road.lineStyle(1.5, 0x261a10, 0.9);
      road.strokeRoundedRect(p.doorPoint.x - 14, p.doorPoint.y - 5, 28, 10, 3);
    });

    // Authentic Cobblestone Texture Stones on Road
    road.fillStyle(0xdfcfb7, 0.75);
    for (let rx = 12; rx < 1430; rx += 28) {
      road.fillRoundedRect(rx, 502 + (rx % 3) * 10, 18, 9, 3);
    }
    for (let ry = 230; ry < 820; ry += 32) {
      road.fillRoundedRect(682 + (ry % 2) * 14, ry, 16, 12, 3);
    }
    for (let px = 710; px < 1380; px += 34) {
      road.fillRoundedRect(px, 402 + (px % 2) * 8, 18, 9, 3);
    }
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

    // Secret Golden Easter Egg Chests
    const chest1 = this.add.image(70, 430, 'prop_chest');
    chest1.setOrigin(0.5, 0.85);
    chest1.setDepth(430);

    const chest2 = this.add.image(1390, 190, 'prop_chest');
    chest2.setOrigin(0.5, 0.85);
    chest2.setDepth(190);

    const chest3 = this.add.image(880, 830, 'prop_chest');
    chest3.setOrigin(0.5, 0.85);
    chest3.setDepth(830);

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
      this.trees.push(tree);
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

    this.npcs.push(aiNpc, libNpc, postNpc);

    // 4. Rich Environment Props (Town Square Fountain, Benches, Gardens, Fences)
    // Town Square Fountain Centerpiece
    const fountain = this.add.image(630, 420, 'prop_fountain');
    fountain.setOrigin(0.5, 0.85);
    fountain.setDepth(420);
    const fountainObs = this.obstacles.create(630, 420, undefined) as Phaser.Physics.Arcade.Sprite;
    fountainObs.setVisible(false);
    fountainObs.setSize(52, 24);
    fountainObs.refreshBody();

    // Park Benches
    [[565, 465], [745, 465], [1215, 695]].forEach(([bx, by]) => {
      const b = this.add.image(bx, by, 'prop_bench');
      b.setOrigin(0.5, 0.85);
      b.setDepth(by);
    });

    // Retro Bicycle outside Library
    const bike = this.add.image(545, 175, 'prop_bicycle');
    bike.setOrigin(0.5, 0.85);
    bike.setDepth(175);

    // Red Postbox outside Post Office
    const pbox = this.add.image(585, 755, 'prop_postbox');
    pbox.setOrigin(0.5, 0.85);
    pbox.setDepth(755);

    // Crossroads Signpost
    const sp = this.add.image(655, 545, 'prop_signpost');
    sp.setOrigin(0.5, 0.85);
    sp.setDepth(545);

    // Picket Fences
    [[90, 225], [138, 225], [186, 225], [90, 745], [138, 745], [540, 195], [740, 195]].forEach(([fx, fy]) => {
      const f = this.add.image(fx, fy, 'prop_fence');
      f.setOrigin(0.5, 0.85);
      f.setDepth(fy);
    });

    // Flower Beds & Gardens
    [[240, 225], [470, 360], [740, 220], [960, 755], [1110, 220], [1230, 640], [340, 540], [1010, 485]].forEach(([flx, fly]) => {
      const fl = this.add.image(flx, fly, 'prop_flower_patch');
      fl.setOrigin(0.5, 0.85);
      fl.setDepth(fly);
    });

    // Pond Lilypads
    const lily1 = this.add.image(1265, 705, 'prop_lilypad');
    lily1.setOrigin(0.5, 0.5);
    lily1.setDepth(710);
    const lily2 = this.add.image(1315, 735, 'prop_lilypad');
    lily2.setOrigin(0.5, 0.5);
    lily2.setDepth(740);

    // Swimming Golden Koi Fish in Pond
    const koi1 = this.add.image(1270, 715, 'prop_koi_fish');
    koi1.setOrigin(0.5, 0.5);
    koi1.setDepth(725);
    this.koiFish.push({ sprite: koi1, angle: 0, speed: 0.016, radiusX: 38, radiusY: 22 });

    const koi2 = this.add.image(1310, 725, 'prop_koi_fish');
    koi2.setOrigin(0.5, 0.5);
    koi2.setDepth(725);
    this.koiFish.push({ sprite: koi2, angle: Math.PI, speed: 0.02, radiusX: 30, radiusY: 18 });

    // Interactive Speech Bubbles for NPCs
    this.createNpcSpeechBubbles();

    // Flying Sky Birds System
    this.birds = [
      { x: 100, y: 130, vx: 1.15, vy: 0.16, wingPhase: 0 },
      { x: 500, y: 170, vx: 1.35, vy: 0.12, wingPhase: 1.6 },
      { x: 920, y: 120, vx: 1.25, vy: 0.2, wingPhase: 3.1 },
    ];

    // 5. Interactive World-Space Badges for all Buildings (Ultra-Crisp & High Contrast)
    this.createPlaceBadges();
  }

  private createPlaceBadges() {
    PLACES.forEach((place) => {
      if (place.id.startsWith('secret-chest-')) return;

      let badgeX = place.zone.x + place.zone.width / 2;
      let badgeY = place.zone.y - 18;

      // Stagger project street badges so each has wide breathing room without any overlap
      if (place.id === 'project-pramaan' || place.id === 'project-data-engine') {
        badgeY = place.zone.y - 58;
      } else if (place.id.startsWith('project-')) {
        badgeY = place.zone.y - 12;
      } else if (place.id === 'tanish-ai-npc') {
        badgeX = 685;
        badgeY = 335;
      } else if (place.id === 'guestbook-stand') {
        badgeX = 610;
        badgeY = 310;
      } else if (place.id === 'cloud-tower') {
        badgeY = place.zone.y - 8;
      } else if (place.id === 'library') {
        badgeY = place.zone.y - 24;
      }

      const container = this.add.container(badgeX, badgeY);
      container.setDepth(2600);

      // Large, Bold, Ultra-Crisp Retina Label Text with modern Outfit typography
      const text = this.add.text(0, 0, place.label, {
        fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
        fontSize: '13.5px',
        color: '#261A10',
        fontStyle: '800',
        resolution: 3,
      });
      text.setOrigin(0, 0.5);

      const textW = text.width;
      const badgeW = Math.max(textW + 36, 92);
      const badgeH = 30;

      // Position text with padding for colored indicator dot
      text.setX(-badgeW / 2 + 22);

      // Pill background
      const bg = this.add.graphics();
      const drawBg = (hover = false) => {
        bg.clear();
        // 3D bottom drop shadow
        bg.fillStyle(0x261a10, 0.95);
        bg.fillRoundedRect(-badgeW / 2, -badgeH / 2 + 3.5, badgeW, badgeH, 15);
        // Pill fill
        bg.fillStyle(hover ? 0xffffff : 0xfffdf7, 1);
        bg.fillRoundedRect(-badgeW / 2, -badgeH / 2, badgeW, badgeH, 15);
        // Crisp Ink outline
        bg.lineStyle(2.2, 0x261a10, 1);
        bg.strokeRoundedRect(-badgeW / 2, -badgeH / 2, badgeW, badgeH, 15);
      };
      drawBg(false);

      // Colored roof indicator dot
      const dot = this.add.graphics();
      const colorInt = parseInt((place.roofColor || '#F6B73C').replace('#', '0x'), 16);
      dot.fillStyle(colorInt, 1);
      dot.fillCircle(-badgeW / 2 + 11, 0, 4.5);
      dot.lineStyle(1.8, 0x261a10, 0.95);
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
          scale: 1.08,
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

      this.badgeContainers.push({
        container,
        baseY: badgeY,
        phase: PLACES.indexOf(place) * 0.75,
      });
    });
  }

  private createNpcSpeechBubbles() {
    const bubbleConfigs = [
      { id: 'tanish', x: 685, y: 340, text: '👋 Hi! Ask me about QUANTORA, RAG & LLMs!' },
      { id: 'librarian', x: 640, y: 175, text: '📚 7 Skill Bookshelves Inside!' },
      { id: 'postmaster', x: 760, y: 715, text: '📬 Looking to Hire or Connect? Drop a Message!' },
    ];

    bubbleConfigs.forEach((cfg) => {
      const bubble = this.add.container(cfg.x, cfg.y);
      bubble.setDepth(2900);
      bubble.setScale(0.7);
      bubble.setAlpha(0);

      const label = this.add.text(0, -2, cfg.text, {
        fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
        fontSize: '12.5px',
        color: '#261A10',
        fontStyle: '800',
        resolution: 3,
      });
      label.setOrigin(0.5, 0.5);

      const bw = label.width + 24;
      const bh = 28;

      const bg = this.add.graphics();
      // Drop shadow
      bg.fillStyle(0x261a10, 0.9);
      bg.fillRoundedRect(-bw / 2, -bh / 2 + 3, bw, bh, 14);
      // Pill fill
      bg.fillStyle(0xfff6e3, 1);
      bg.fillRoundedRect(-bw / 2, -bh / 2, bw, bh, 14);
      // Outline
      bg.lineStyle(2, 0x261a10, 1);
      bg.strokeRoundedRect(-bw / 2, -bh / 2, bw, bh, 14);
      // Little speech tail
      bg.fillStyle(0xfff6e3, 1);
      bg.fillTriangle(-5, bh / 2, 5, bh / 2, 0, bh / 2 + 6);
      bg.lineStyle(2, 0x261a10, 1);
      bg.beginPath();
      bg.moveTo(-5, bh / 2);
      bg.lineTo(0, bh / 2 + 6);
      bg.lineTo(5, bh / 2);
      bg.strokePath();

      bubble.add([bg, label]);
      this.npcBubbles.set(cfg.id, {
        container: bubble,
        targetX: cfg.x,
        targetY: cfg.y,
        visible: false,
      });
    });
  }

  private updateNpcBubbles() {
    const playerPos = new Phaser.Math.Vector2(this.player.x, this.player.y);
    const npcPositions: Record<string, { x: number; y: number }> = {
      tanish: { x: 685, y: 390 },
      librarian: { x: 640, y: 220 },
      postmaster: { x: 760, y: 760 },
    };

    this.npcBubbles.forEach((bubble, id) => {
      const npcPos = npcPositions[id];
      if (!npcPos) return;
      const dist = playerPos.distance(new Phaser.Math.Vector2(npcPos.x, npcPos.y));

      if (dist < 95 && !bubble.visible) {
        bubble.visible = true;
        this.tweens.killTweensOf(bubble.container);
        this.tweens.add({
          targets: bubble.container,
          scale: 1,
          alpha: 1,
          y: bubble.targetY - 6,
          duration: 240,
          ease: 'Back.easeOut',
        });
      } else if (dist >= 115 && bubble.visible) {
        bubble.visible = false;
        this.tweens.killTweensOf(bubble.container);
        this.tweens.add({
          targets: bubble.container,
          scale: 0.7,
          alpha: 0,
          y: bubble.targetY,
          duration: 180,
          ease: 'Sine.easeIn',
        });
      }
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
    const season = useGameStore.getState().season;
    const isNight = season === 'night';
    const isSunset = season === 'sunset';
    this.fxGraphics.clear();

    // Streetlamp warm light halo in sunset and night
    if (isNight || isSunset) {
      const haloAlpha = isNight ? 0.28 : 0.15;
      [[651, 448], [751, 448], [651, 600], [751, 600]].forEach(([lx, ly]) => {
        this.fxGraphics.fillStyle(0xffe072, haloAlpha);
        this.fxGraphics.fillCircle(lx, ly, 40);
        this.fxGraphics.fillStyle(0xfff3a8, haloAlpha * 1.6);
        this.fxGraphics.fillCircle(lx, ly, 18);
      });
    }

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
      } else if (p.type === 'firefly' && (isNight || isSunset)) {
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

    // Animated Cyber Hologram Pedestal under Tanish AI NPC
    const aiRingTime = this.time.now / 350;
    const aiPulse = 0.55 + Math.sin(aiRingTime) * 0.35;
    this.fxGraphics.lineStyle(2, 0x00f0ff, aiPulse * 0.95);
    this.fxGraphics.strokeEllipse(685, 396, 28 + Math.sin(aiRingTime * 1.5) * 3, 12 + Math.sin(aiRingTime * 1.5) * 1.5);
    this.fxGraphics.fillStyle(0x00f0ff, aiPulse * 0.22);
    this.fxGraphics.fillEllipse(685, 396, 22, 9);

    // Animated Fountain Water Sprays with Cascading Drops & Basin Ripples
    const fTime = this.time.now / 150;
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI) / 2.5 + fTime * 0.5;
      const fDropX = 630 + Math.cos(angle) * 10;
      const fDropY = 405 - Math.abs(Math.sin(fTime + i * 0.8)) * 12;
      this.fxGraphics.fillStyle(0xffffff, 0.95);
      this.fxGraphics.fillCircle(fDropX, fDropY, 2.2);

      // Expanding ripples on the water basin
      const rPhase = ((this.time.now / 600) + i * 0.25) % 1;
      this.fxGraphics.lineStyle(1.5, 0x7ccbea, (1 - rPhase) * 0.75);
      this.fxGraphics.strokeEllipse(630, 424, rPhase * 28, rPhase * 10);
    }

    // Animated Fluttering Butterflies over flowerbeds (with real flapping wings)
    const bTime = this.time.now / 320;
    const wingFlap = Math.max(0.15, Math.abs(Math.sin(this.time.now / 45)));

    // Butterfly 1: Golden Yellow near Home's Garden
    const b1x = 240 + Math.sin(bTime) * 22;
    const b1y = 220 + Math.cos(bTime * 2) * 10;
    this.fxGraphics.fillStyle(0xf6b73c, 0.95);
    this.fxGraphics.fillEllipse(b1x - 3 * wingFlap, b1y, 4 * wingFlap, 2.5);
    this.fxGraphics.fillEllipse(b1x + 3 * wingFlap, b1y, 4 * wingFlap, 2.5);

    // Butterfly 2: Electric Cyan near Library
    const b2x = 740 + Math.cos(bTime * 0.8) * 24;
    const b2y = 215 + Math.sin(bTime * 1.6) * 12;
    this.fxGraphics.fillStyle(0x00f0ff, 0.95);
    this.fxGraphics.fillEllipse(b2x - 3 * wingFlap, b2y, 4 * wingFlap, 2.5);
    this.fxGraphics.fillEllipse(b2x + 3 * wingFlap, b2y, 4 * wingFlap, 2.5);

    // Butterfly 3: Ruby Coral near Workshop
    const b3x = 1010 + Math.sin(bTime * 1.1) * 20;
    const b3y = 485 + Math.cos(bTime * 1.4) * 10;
    this.fxGraphics.fillStyle(0xe0674a, 0.95);
    this.fxGraphics.fillEllipse(b3x - 3 * wingFlap, b3y, 4 * wingFlap, 2.5);
    this.fxGraphics.fillEllipse(b3x + 3 * wingFlap, b3y, 4 * wingFlap, 2.5);

    // Animated Birds Flying Across the Sky
    for (const bird of this.birds) {
      bird.x += bird.vx;
      bird.y += bird.vy;
      bird.wingPhase += 0.22;

      // Wrap around when off-screen
      if (bird.x > 1520) {
        bird.x = -60;
        bird.y = 80 + Math.random() * 260;
        bird.vx = 1.0 + Math.random() * 0.5;
        bird.vy = (Math.random() - 0.5) * 0.3;
      }

      const wingY = Math.sin(bird.wingPhase) * 3.5;
      // Soft ground shadow
      this.fxGraphics.fillStyle(0x000000, 0.12);
      this.fxGraphics.fillEllipse(bird.x, bird.y + 110, 8, 3.5);

      // Bird silhouette (flapping wings V-shape)
      this.fxGraphics.lineStyle(2, 0x3a2a1e, 0.85);
      this.fxGraphics.beginPath();
      this.fxGraphics.moveTo(bird.x - 7, bird.y - wingY);
      this.fxGraphics.lineTo(bird.x, bird.y);
      this.fxGraphics.lineTo(bird.x + 7, bird.y - wingY);
      this.fxGraphics.strokePath();
    }

    // Walking Dust Puff Particles
    for (let i = this.dustPuffs.length - 1; i >= 0; i--) {
      const d = this.dustPuffs[i];
      d.x += d.vx;
      d.y += d.vy;
      d.alpha -= 0.03;
      d.size += 0.06;
      if (d.alpha <= 0) {
        this.dustPuffs.splice(i, 1);
        continue;
      }
      this.fxGraphics.fillStyle(0xd5c8b2, d.alpha);
      this.fxGraphics.fillCircle(d.x, d.y, d.size);
    }

    // Interactive Sparkle Bursts
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const sp = this.sparkles[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vx *= 0.94;
      sp.vy *= 0.94;
      sp.alpha -= 0.028;
      sp.size = Math.max(1, sp.size - 0.04);
      if (sp.alpha <= 0) {
        this.sparkles.splice(i, 1);
        continue;
      }
      this.fxGraphics.fillStyle(sp.color, sp.alpha);
      this.fxGraphics.fillCircle(sp.x, sp.y, sp.size);
    }

    // Sparkling Water Highlights on Fountain & Pond
    const shimmer = Math.sin(this.time.now / 140);
    if (shimmer > 0.4) {
      this.fxGraphics.fillStyle(0xffffff, shimmer * 0.9);
      // Pond shimmers
      this.fxGraphics.fillCircle(1280, 712, 1.8);
      this.fxGraphics.fillCircle(1325, 730, 2);
      this.fxGraphics.fillCircle(1260, 725, 1.6);
      // Fountain shimmers
      this.fxGraphics.fillCircle(630, 420, 2.2);
    }
  }

  private createInteractionUI() {
    this.promptContainer = this.add.container(0, 0);
    this.promptContainer.setDepth(9999);
    this.promptContainer.setVisible(false);

    // 3D Drop Shadow & Pill Background
    const shadow = this.add.graphics();
    shadow.fillStyle(0x261a10, 0.9);
    shadow.fillRoundedRect(-120, -17, 240, 38, 19);

    const bg = this.add.graphics();
    bg.fillStyle(0xfff6e3, 1);
    bg.fillRoundedRect(-120, -19, 240, 36, 18);
    bg.lineStyle(2.5, 0x261a10, 1);
    bg.strokeRoundedRect(-120, -19, 240, 36, 18);

    // Golden [ E ] Keyboard Key Pill Badge
    const keyBadge = this.add.graphics();
    keyBadge.fillStyle(0xf6b73c, 1);
    keyBadge.fillRoundedRect(-108, -12, 28, 22, 6);
    keyBadge.lineStyle(2, 0x261a10, 1);
    keyBadge.strokeRoundedRect(-108, -12, 28, 22, 6);

    const keyLabel = this.add.text(-94, -1, 'E', {
      fontFamily: 'Fredoka, Nunito, system-ui, sans-serif',
      fontSize: '13px',
      color: '#261A10',
      fontStyle: '800',
      resolution: 3,
    }).setOrigin(0.5);

    this.promptText = this.add.text(12, -1, 'Enter Building', {
      fontFamily: 'Fredoka, Nunito, system-ui, sans-serif',
      fontSize: '13px',
      color: '#261A10',
      fontStyle: '800',
      resolution: 3,
    }).setOrigin(0.5);

    this.promptContainer.add([shadow, bg, keyBadge, keyLabel, this.promptText]);
    this.promptContainer.setSize(240, 38);
    this.promptContainer.setInteractive({ useHandCursor: true });

    // Click to enter directly
    this.promptContainer.on('pointerdown', () => {
      if (this.nearestPlace) {
        if (this.nearestPlace.id.startsWith('secret-chest-')) {
          soundEffects.playChestChime();
        } else {
          soundEffects.playEnter();
        }
        this.spawnSparkles(this.nearestPlace.doorPoint.x, this.nearestPlace.doorPoint.y, 0xf6b73c);
        useGameStore.getState().markVisited(this.nearestPlace.id);
        if (this.nearestPlace.panel) {
          useGameStore.getState().openPanel(this.nearestPlace.panel, this.nearestPlace.projectId);
        } else if (this.nearestPlace.externalUrl) {
          window.open(this.nearestPlace.externalUrl, '_blank', 'noopener,noreferrer');
        }
      }
    });

    this.arrowGraphic = this.add.graphics();
    this.arrowGraphic.setDepth(9998);
    this.arrowGraphic.fillStyle(0xf6b73c, 1);
    this.arrowGraphic.lineStyle(2, 0x261a10, 1);
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
    this.updateNpcBubbles();

    // 1. Floating organic bobbing on building roof badges
    const badgeTime = this.time.now / 480;
    for (const b of this.badgeContainers) {
      b.container.y = b.baseY + Math.sin(badgeTime + b.phase) * 3.5;
    }

    // 2. Natural wind swaying on trees
    const windTime = this.time.now / 700;
    for (let i = 0; i < this.trees.length; i++) {
      this.trees[i].angle = Math.sin(windTime + i * 0.7) * 2.2;
    }

    // 3. Swimming Golden Koi Fish in pond
    for (const fish of this.koiFish) {
      fish.angle += fish.speed;
      fish.sprite.x = 1290 + Math.cos(fish.angle) * fish.radiusX;
      fish.sprite.y = 720 + Math.sin(fish.angle) * fish.radiusY;
      fish.sprite.rotation = fish.angle + Math.PI / 2 + Math.sin(this.time.now / 80) * 0.18;
    }

    // 4. Idle breathing cycle on NPCs
    const npcBreathe = Math.sin(this.time.now / 320) * 0.03;
    for (const npc of this.npcs) {
      npc.scaleY = 1 + npcBreathe;
    }

    // Re-center follow on player movement
    if (this.player.body && (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0)) {
      this.recenterCamera();
    }

    // Check distance to interactive zones (Forgiving proximity & porch detection)
    let currentNearby: Place | null = null;
    let closestDist = 9999;
    const playerFeet = new Phaser.Math.Vector2(this.player.x, this.player.y + 16);

    for (const place of PLACES) {
      const dPoint = new Phaser.Math.Vector2(place.doorPoint.x, place.doorPoint.y);
      const dist = playerFeet.distance(dPoint);

      const inFrontOfBuilding =
        playerFeet.x >= place.zone.x - 30 &&
        playerFeet.x <= place.zone.x + place.zone.width + 30 &&
        playerFeet.y >= place.zone.y + place.zone.height - 30 &&
        playerFeet.y <= place.zone.y + place.zone.height + 85;

      if ((dist < 85 || inFrontOfBuilding) && dist < closestDist) {
        currentNearby = place;
        closestDist = dist;
      }
    }

    if (this.nearestPlace !== currentNearby) {
      this.nearestPlace = currentNearby;
      useGameStore.getState().setCurrentZone(currentNearby);
    }

    if (currentNearby) {
      this.promptContainer.setPosition(this.player.x, this.player.y - 44);
      this.promptText.setText(`Enter ${currentNearby.name}`);
      this.promptContainer.setVisible(true);

      const bobY = Math.sin(this.time.now / 150) * 4;
      this.arrowGraphic.setPosition(currentNearby.doorPoint.x, currentNearby.doorPoint.y - 18 + bobY);
      this.arrowGraphic.setVisible(true);

      const justE = Phaser.Input.Keyboard.JustDown(this.eKey);
      const justEnter = Phaser.Input.Keyboard.JustDown(this.enterKey);

      if (justE || justEnter) {
        if (currentNearby.id.startsWith('secret-chest-')) {
          soundEffects.playChestChime();
        } else {
          soundEffects.playEnter();
        }
        this.spawnSparkles(currentNearby.doorPoint.x, currentNearby.doorPoint.y, 0xf6b73c);
        useGameStore.getState().markVisited(currentNearby.id);
        if (currentNearby.panel) {
          useGameStore.getState().openPanel(currentNearby.panel, currentNearby.projectId);
        } else if (currentNearby.externalUrl) {
          window.open(currentNearby.externalUrl, '_blank', 'noopener,noreferrer');
        }
      }
    } else {
      this.promptContainer.setVisible(false);
      this.arrowGraphic.setVisible(false);
    }
  }
}
