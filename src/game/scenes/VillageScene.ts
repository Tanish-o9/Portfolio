import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { PLACES, Place } from '../../data/places';
import { useGameStore } from '../../state/gameStore';

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

  constructor() {
    super({ key: 'VillageScene' });
  }

  create() {
    const worldWidth = 1440;
    const worldHeight = 900;

    // Set world and physics bounds
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    // 1. Ground: Lush grass base
    this.add.rectangle(worldWidth / 2, worldHeight / 2, worldWidth, worldHeight, 0x94cf7a);

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

    // 6. Camera Setup: Lerp follow, clamped to bounds
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // 7. Input Controls: E and Enter for interaction
    if (this.input.keyboard) {
      this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    // 8. Pointer Click-to-Move
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Convert screen to world coordinate
      const worldX = pointer.worldX;
      const worldY = pointer.worldY;
      this.player.setTarget(worldX, worldY);
    });

    // 9. Floating Interaction Prompt & Arrow
    this.createInteractionUI();

    // Listen for Walk Target from store (when pill label is clicked)
    useGameStore.subscribe((state) => {
      if (state.walkTarget) {
        this.player.setTarget(state.walkTarget.x, state.walkTarget.y);
        useGameStore.getState().setWalkTarget(null);
      }
    });
  }

  private drawRoadNetwork() {
    const road = this.add.graphics();
    road.fillStyle(0xeadfcb, 1);
    road.lineStyle(3, 0xbdae92, 1);

    const roads = [
      // Horizontal Main Road at y=520 (full width, 48px height)
      { x: 0, y: 496, w: 1440, h: 48 },
      // Vertical Road at x=700 (y: 220 to 830, 48px width)
      { x: 676, y: 220, w: 48, h: 610 },
      // Road to Home (x: 208, y: 290 to 520)
      { x: 184, y: 290, w: 48, h: 230 },
      // Road to CCC Tower (x: 1165, y: 250 to 520)
      { x: 1141, y: 250, w: 48, h: 270 },
      // Road to College (x: 208, y: 520 to 800)
      { x: 184, y: 520, w: 48, h: 280 },
      // Road to Workshop (x: 1060, y: 520 to 790)
      { x: 1036, y: 520, w: 48, h: 270 },
      // Project Street at y=412 (x: 700 to 1400)
      { x: 700, y: 396, w: 700, h: 36 },
      // Town Square Plaza around (580 to 740, y: 320 to 496)
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

      // Add physical collision box to base of building
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
          // Entrance zone rectangle
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

    // 1. Home (About) top-left
    addBuildingObject('bldg_home', 100, 90, 120, 60, 'home');

    // 2. Library (Skills) top-center
    addBuildingObject('bldg_library', 570, 50, 160, 65, 'library');

    // 3. CCC Tower (Experience) top-right
    addBuildingObject('bldg_tower', 1090, 20, 100, 70, 'cloud-tower');

    // 4. Project Street (5 small houses)
    addBuildingObject('bldg_quantora', 770, 280, 80, 45, 'project-quantora');
    addBuildingObject('bldg_pramaan', 895, 280, 80, 45, 'project-pramaan');
    addBuildingObject('bldg_whytrace', 1020, 280, 80, 45, 'project-whytrace');
    addBuildingObject('bldg_data_engine', 1145, 280, 80, 45, 'project-data-engine');
    addBuildingObject('bldg_mini_vlm', 1270, 280, 80, 45, 'project-mini-vlm');

    // 5. College (bottom-left)
    addBuildingObject('bldg_college', 100, 610, 140, 65, 'college');

    // 6. Post Office (bottom-center)
    addBuildingObject('bldg_post_office', 605, 655, 120, 50, 'post-office');

    // 7. GitHub Workshop (bottom-right)
    addBuildingObject('bldg_workshop', 960, 640, 110, 50, 'workshop-sign');

    // 8. Notice Board
    addBuildingObject('prop_notice_board', 400, 380, 50, 25, 'notice-board');

    // 9. Guestbook Stand
    addBuildingObject('prop_guestbook', 580, 330, 40, 25, 'guestbook-stand');

    // 10. Pond (Solid obstacle)
    const pondImg = this.add.image(1290, 720, 'prop_pond');
    pondImg.setOrigin(0.5, 0.5);
    pondImg.setDepth(720);
    const pondObs = this.obstacles.create(1290, 720, undefined) as Phaser.Physics.Arcade.Sprite;
    pondObs.setVisible(false);
    pondObs.setSize(100, 70);
    pondObs.refreshBody();

    // 11. Street Lamps
    [
      [651, 448],
      [751, 448],
      [651, 600],
      [751, 600],
    ].forEach(([lx, ly]) => {
      const lamp = this.add.image(lx, ly, 'prop_lamp');
      lamp.setOrigin(0.5, 0.9);
      lamp.setDepth(ly);
    });

    // 12. Decorative Trees along perimeter
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
      // Trunk collider
      const trunk = this.obstacles.create(tx, ty, undefined) as Phaser.Physics.Arcade.Sprite;
      trunk.setVisible(false);
      trunk.setSize(20, 14);
      trunk.refreshBody();
    });

    // 13. Ambient NPCs
    // Librarian near Library (650, 220)
    const libNpc = this.add.image(640, 220, 'npc_librarian');
    libNpc.setOrigin(0.5, 0.9);
    libNpc.setDepth(220);

    // Postmaster near Post Office (760, 760)
    const postNpc = this.add.image(760, 760, 'npc_postmaster');
    postNpc.setOrigin(0.5, 0.9);
    postNpc.setDepth(760);
  }

  private createInteractionUI() {
    this.promptContainer = this.add.container(0, 0);
    this.promptContainer.setDepth(9999);
    this.promptContainer.setVisible(false);

    this.promptBg = this.add.rectangle(0, 0, 220, 36, 0xfff6e3);
    this.promptBg.setStrokeStyle(2, 0x3a2a1e);
    this.promptText = this.add.text(0, 0, 'Press E to Enter', {
      fontFamily: 'Inter, sans-serif',
      fontSize: '12px',
      color: '#3A2A1E',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.promptContainer.add([this.promptBg, this.promptText]);

    // Bobbing Arrow
    this.arrowGraphic = this.add.graphics();
    this.arrowGraphic.setDepth(9998);
    this.arrowGraphic.fillStyle(0xf6b73c, 1);
    this.arrowGraphic.lineStyle(2, 0x3a2a1e, 1);
    // Downward triangle
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
      // Show prompt right above player
      this.promptContainer.setPosition(this.player.x, this.player.y - 40);
      this.promptText.setText(`Press E · Enter ${currentNearby.name}`);
      this.promptContainer.setVisible(true);

      // Show bobbing arrow over the building door
      const bobY = Math.sin(this.time.now / 150) * 4;
      this.arrowGraphic.setPosition(currentNearby.doorPoint.x, currentNearby.doorPoint.y - 20 + bobY);
      this.arrowGraphic.setVisible(true);

      // Check if E or Enter was pressed
      const justE = Phaser.Input.Keyboard.JustDown(this.eKey);
      const justEnter = Phaser.Input.Keyboard.JustDown(this.enterKey);

      if (justE || justEnter) {
        useGameStore.getState().markVisited(currentNearby.id);
        if (currentNearby.externalUrl) {
          window.open(currentNearby.externalUrl, '_blank', 'noopener,noreferrer');
        } else if (currentNearby.panel) {
          useGameStore.getState().openPanel(currentNearby.panel, currentNearby.projectId);
        }
      }
    } else {
      this.promptContainer.setVisible(false);
      this.arrowGraphic.setVisible(false);
    }
  }
}
