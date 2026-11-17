import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.createPlayerTextures();
    this.createPetTextures();
    this.createBuildingTextures();
    this.createEnvironmentTextures();
    this.createNpcTextures();
  }

  create() {
    this.scene.start('VillageScene');
  }

  private createPlayerTextures() {
    // 1. Shadow Blob
    const shadow = this.make.graphics({ x: 0, y: 0 });
    shadow.fillStyle(0x000000, 0.25);
    shadow.fillEllipse(14, 6, 24, 10);
    shadow.generateTexture('shadow_blob', 28, 12);
    shadow.destroy();

    // 2. Player Character (Illustrated style, dark ink outline #3A2A1E, cream skin, tunic)
    // Frame 0: Front Idle
    const pFront = this.make.graphics({ x: 0, y: 0 });
    pFront.fillStyle(0x3a2a1e, 1);
    pFront.fillRoundedRect(4, 2, 20, 20, 10); // Head
    pFront.fillRoundedRect(2, 18, 24, 26, 6);  // Body
    // Skin / Hair
    pFront.fillStyle(0x3a2a1e, 1);
    pFront.fillRoundedRect(4, 2, 20, 8, 4);   // Dark hair
    pFront.fillStyle(0xffdbb5, 1);
    pFront.fillRoundedRect(6, 8, 16, 12, 4);  // Face
    // Eyes
    pFront.fillStyle(0x3a2a1e, 1);
    pFront.fillRect(9, 12, 2, 3);
    pFront.fillRect(17, 12, 2, 3);
    // Tunic (Electric Blue #4F8CFF)
    pFront.fillStyle(0x4f8cff, 1);
    pFront.fillRoundedRect(4, 20, 20, 16, 4);
    // Belt & Pants
    pFront.fillStyle(0xf6b73c, 1);
    pFront.fillRect(4, 30, 20, 3); // Belt
    pFront.fillStyle(0x1e2b45, 1);
    pFront.fillRect(6, 36, 6, 8);  // Left leg
    pFront.fillRect(16, 36, 6, 8); // Right leg
    pFront.generateTexture('player_front', 28, 46);
    pFront.destroy();

    // Frame 1: Back (walking away)
    const pBack = this.make.graphics({ x: 0, y: 0 });
    pBack.fillStyle(0x3a2a1e, 1);
    pBack.fillRoundedRect(4, 2, 20, 20, 10);
    pBack.fillRoundedRect(2, 18, 24, 26, 6);
    pBack.fillStyle(0x3a2a1e, 1);
    pBack.fillRoundedRect(5, 3, 18, 16, 6); // Hair
    pBack.fillStyle(0x4f8cff, 1);
    pBack.fillRoundedRect(4, 20, 20, 16, 4);
    pBack.fillStyle(0x1e2b45, 1);
    pBack.fillRect(6, 36, 6, 8);
    pBack.fillRect(16, 36, 6, 8);
    pBack.generateTexture('player_back', 28, 46);
    pBack.destroy();

    // Frame 2: Side
    const pSide = this.make.graphics({ x: 0, y: 0 });
    pSide.fillStyle(0x3a2a1e, 1);
    pSide.fillRoundedRect(4, 2, 20, 20, 10);
    pSide.fillRoundedRect(4, 18, 20, 26, 6);
    pSide.fillStyle(0x3a2a1e, 1);
    pSide.fillRoundedRect(4, 2, 14, 14, 4); // Hair
    pSide.fillStyle(0xffdbb5, 1);
    pSide.fillRoundedRect(12, 8, 10, 12, 3); // Face
    pSide.fillStyle(0x3a2a1e, 1);
    pSide.fillRect(18, 12, 2, 3); // Eye
    pSide.fillStyle(0x4f8cff, 1);
    pSide.fillRoundedRect(4, 20, 18, 16, 4);
    pSide.fillStyle(0x1e2b45, 1);
    pSide.fillRect(10, 36, 7, 8);
    pSide.generateTexture('player_side', 28, 46);
    pSide.destroy();
  }

  private createPetTextures() {
    // 1. AI Companion Drone (Floating Cyan Orb)
    const drone = this.make.graphics({ x: 0, y: 0 });
    // Soft shadow
    drone.fillStyle(0x000000, 0.2);
    drone.fillEllipse(10, 19, 14, 6);
    // Body & dark outline
    drone.fillStyle(0x3a2a1e, 1);
    drone.fillCircle(10, 9, 8);
    // Metallic Teal/Cyan shell
    drone.fillStyle(0x266f73, 1);
    drone.fillCircle(10, 9, 6.5);
    // Glowing cyan visor eye
    drone.fillStyle(0x00f0ff, 1);
    drone.fillRoundedRect(6, 7, 8, 4, 2);
    // Top antenna
    drone.fillStyle(0xf6b73c, 1);
    drone.fillCircle(10, 2, 1.5);
    drone.generateTexture('pet_drone', 20, 22);
    drone.destroy();

    // 2. Cozy Chibi Cat
    const cat = this.make.graphics({ x: 0, y: 0 });
    cat.fillStyle(0x000000, 0.2);
    cat.fillEllipse(10, 18, 16, 6);
    // Body
    cat.fillStyle(0x3a2a1e, 1);
    cat.fillRoundedRect(3, 7, 14, 10, 4);
    cat.fillStyle(0xf6b73c, 1);
    cat.fillRoundedRect(4, 8, 12, 8, 3);
    // Head & Ears
    cat.fillStyle(0x3a2a1e, 1);
    cat.fillCircle(6, 6, 5);
    cat.fillTriangle(3, 4, 5, 0, 7, 4); // Left ear
    cat.fillTriangle(7, 4, 9, 0, 11, 4); // Right ear
    cat.fillStyle(0xfff6e3, 1);
    cat.fillCircle(6, 6, 3.5);
    // Eyes
    cat.fillStyle(0x3a2a1e, 1);
    cat.fillRect(5, 5, 1, 2);
    cat.fillRect(8, 5, 1, 2);
    // Tail
    cat.lineStyle(2, 0x3a2a1e, 1);
    cat.beginPath();
    cat.moveTo(15, 12);
    cat.lineTo(19, 8);
    cat.strokePath();
    cat.generateTexture('pet_cat', 22, 20);
    cat.destroy();
  }

  private createBuildingTextures() {
    const makeBuilding = (
      key: string,
      w: number,
      h: number,
      roofColor: number,
      wallColor = 0xfff1d6,
      details?: (g: Phaser.GameObjects.Graphics) => void
    ) => {
      const g = this.make.graphics({ x: 0, y: 0 });
      // Ground shadow
      g.fillStyle(0x000000, 0.2);
      g.fillRoundedRect(4, h - 8, w, 12, 6);

      // Walls
      g.fillStyle(0x3a2a1e, 1);
      g.fillRoundedRect(6, 26, w - 12, h - 28, 8); // Outline
      g.fillStyle(wallColor, 1);
      g.fillRoundedRect(9, 29, w - 18, h - 34, 6);

      // Roof
      g.fillStyle(0x3a2a1e, 1);
      g.fillRoundedRect(2, 4, w - 4, 30, 8); // Roof outline
      g.fillStyle(roofColor, 1);
      g.fillRoundedRect(5, 7, w - 10, 24, 6);

      // Door
      const dw = Math.min(26, w / 4);
      const dh = 30;
      const dx = w / 2 - dw / 2;
      const dy = h - dh - 5;
      g.fillStyle(0x3a2a1e, 1);
      g.fillRoundedRect(dx, dy, dw, dh, 4);
      g.fillStyle(0x8b5a2b, 1);
      g.fillRoundedRect(dx + 2, dy + 2, dw - 4, dh - 2, 3);
      g.fillStyle(0xf6b73c, 1);
      g.fillCircle(dx + dw - 6, dy + dh / 2, 2);

      // Windows
      const winW = 16;
      const winH = 16;
      if (w > 80) {
        g.fillStyle(0x3a2a1e, 1);
        g.fillRoundedRect(16, 42, winW, winH, 3);
        g.fillStyle(0x7ccbea, 1);
        g.fillRect(18, 44, winW - 4, winH - 4);

        g.fillStyle(0x3a2a1e, 1);
        g.fillRoundedRect(w - 16 - winW, 42, winW, winH, 3);
        g.fillStyle(0x7ccbea, 1);
        g.fillRect(w - 14 - winW, 44, winW - 4, winH - 4);
      }

      if (details) details(g);

      g.generateTexture(key, w + 8, h + 8);
      g.destroy();
    };

    makeBuilding('bldg_home', 140, 130, 0x2e8a8f, 0xfff1d6, (g) => {
      g.fillStyle(0x3a2a1e, 1);
      g.fillRect(100, 0, 14, 18);
      g.fillStyle(0xd9503f, 1);
      g.fillRect(102, 2, 10, 14);
      g.fillStyle(0x3e9b5e, 1);
      g.fillRect(16, 58, 16, 4);
      g.fillStyle(0xe0674a, 1);
      g.fillCircle(20, 58, 2);
      g.fillCircle(28, 58, 2);
    });

    makeBuilding('bldg_library', 180, 140, 0xe8804f, 0xfff6e3, (g) => {
      g.fillStyle(0x3a2a1e, 1);
      g.fillCircle(90, 20, 10);
      g.fillStyle(0xfff6e3, 1);
      g.fillCircle(90, 20, 8);
      g.fillStyle(0xe8804f, 1);
      g.fillRect(84, 18, 12, 4);
    });

    makeBuilding('bldg_tower', 120, 180, 0x4a78c2, 0xe8f0fe, (g) => {
      g.fillStyle(0xffffff, 1);
      g.fillCircle(50, 6, 10);
      g.fillCircle(64, 4, 14);
      g.fillCircle(78, 6, 10);
    });

    makeBuilding('bldg_quantora', 90, 90, 0xd9503f);
    makeBuilding('bldg_pramaan', 90, 90, 0x7b6bc4);
    makeBuilding('bldg_whytrace', 90, 90, 0xd9a441);
    makeBuilding('bldg_data_engine', 90, 90, 0xe8a640);
    makeBuilding('bldg_mini_vlm', 90, 90, 0x4a78c2);

    makeBuilding('bldg_college', 160, 130, 0x4a78c2, 0xfff1d6, (g) => {
      g.fillStyle(0x3a2a1e, 1);
      g.fillCircle(80, 16, 10);
      g.fillStyle(0xfff6e3, 1);
      g.fillCircle(80, 16, 8);
      g.fillStyle(0x3a2a1e, 1);
      g.fillRect(79, 11, 2, 6);
      g.fillRect(79, 15, 5, 2);
    });

    makeBuilding('bldg_post_office', 140, 110, 0xd9503f, 0xfff6e3, (g) => {
      g.fillStyle(0xffffff, 1);
      g.fillRect(60, 14, 20, 12);
      g.fillStyle(0xd9503f, 1);
      g.fillRect(62, 16, 16, 8);
    });

    makeBuilding('bldg_workshop', 130, 110, 0x3a2a1e, 0xdfcbb5, (g) => {
      g.fillStyle(0xf6b73c, 1);
      g.fillCircle(65, 18, 8);
      g.fillStyle(0xdfcbb5, 1);
      g.fillCircle(65, 18, 4);
    });

    // Notice Board: 70x60
    const nb = this.make.graphics({ x: 0, y: 0 });
    nb.fillStyle(0x000000, 0.2);
    nb.fillRoundedRect(4, 52, 62, 8, 4);
    nb.fillStyle(0x3a2a1e, 1);
    nb.fillRect(10, 10, 8, 48);
    nb.fillRect(52, 10, 8, 48);
    nb.fillStyle(0x8b5a2b, 1);
    nb.fillRect(12, 12, 4, 44);
    nb.fillRect(54, 12, 4, 44);
    nb.fillStyle(0x3a2a1e, 1);
    nb.fillRoundedRect(4, 6, 62, 36, 4);
    nb.fillStyle(0xf6b73c, 1);
    nb.fillRoundedRect(6, 8, 58, 32, 3);
    nb.fillStyle(0xffffff, 1);
    nb.fillRect(14, 12, 18, 22);
    nb.fillRect(38, 14, 18, 18);
    nb.generateTexture('prop_notice_board', 72, 64);
    nb.destroy();

    // Guestbook Stand: 60x60
    const gb = this.make.graphics({ x: 0, y: 0 });
    gb.fillStyle(0x000000, 0.2);
    gb.fillRoundedRect(10, 50, 40, 8, 4);
    gb.fillStyle(0x3a2a1e, 1);
    gb.fillRect(26, 20, 8, 32);
    gb.fillStyle(0x8b5a2b, 1);
    gb.fillRect(28, 22, 4, 28);
    gb.fillStyle(0x3a2a1e, 1);
    gb.fillRoundedRect(12, 8, 36, 18, 3);
    gb.fillStyle(0xfff6e3, 1);
    gb.fillRect(14, 10, 15, 14);
    gb.fillRect(31, 10, 15, 14);
    gb.fillStyle(0xd9503f, 1);
    gb.fillRect(29, 8, 2, 18);
    gb.generateTexture('prop_guestbook', 62, 62);
    gb.destroy();
  }

  private createEnvironmentTextures() {
    // 1. Cobblestone Path tile
    const path = this.make.graphics({ x: 0, y: 0 });
    path.fillStyle(0xeadfcb, 1);
    path.fillRect(0, 0, 32, 32);
    path.fillStyle(0xbdae92, 0.5);
    path.strokeRect(0, 0, 32, 32);
    path.fillStyle(0xbdae92, 0.6);
    path.fillRoundedRect(2, 2, 12, 10, 2);
    path.fillRoundedRect(16, 4, 14, 10, 2);
    path.fillRoundedRect(4, 16, 14, 12, 2);
    path.fillRoundedRect(20, 18, 10, 10, 2);
    path.generateTexture('tile_path', 32, 32);
    path.destroy();

    // 2. Tree
    const tree = this.make.graphics({ x: 0, y: 0 });
    tree.fillStyle(0x000000, 0.2);
    tree.fillEllipse(32, 74, 40, 12);
    tree.fillStyle(0x3a2a1e, 1);
    tree.fillRect(27, 44, 10, 30);
    tree.fillStyle(0x8b5a2b, 1);
    tree.fillRect(29, 46, 6, 26);
    tree.fillStyle(0x3a2a1e, 1);
    tree.fillCircle(32, 32, 28);
    tree.fillStyle(0x3e9b5e, 1);
    tree.fillCircle(32, 32, 25);
    tree.fillStyle(0x47a868, 1);
    tree.fillCircle(28, 28, 18);
    tree.generateTexture('prop_tree_green', 66, 82);
    tree.destroy();

    // 3. Autumn Tree
    const treeAutumn = this.make.graphics({ x: 0, y: 0 });
    treeAutumn.fillStyle(0x000000, 0.2);
    treeAutumn.fillEllipse(32, 74, 40, 12);
    treeAutumn.fillStyle(0x3a2a1e, 1);
    treeAutumn.fillRect(27, 44, 10, 30);
    treeAutumn.fillStyle(0x8b5a2b, 1);
    treeAutumn.fillRect(29, 46, 6, 26);
    treeAutumn.fillStyle(0x3a2a1e, 1);
    treeAutumn.fillCircle(32, 32, 28);
    treeAutumn.fillStyle(0xe8a640, 1);
    treeAutumn.fillCircle(32, 32, 25);
    treeAutumn.fillStyle(0xf6b73c, 1);
    treeAutumn.fillCircle(28, 28, 18);
    treeAutumn.generateTexture('prop_tree_autumn', 66, 82);
    treeAutumn.destroy();

    // 4. Street Lamp
    const lamp = this.make.graphics({ x: 0, y: 0 });
    lamp.fillStyle(0x3a2a1e, 1);
    lamp.fillRect(10, 12, 4, 34);
    lamp.fillCircle(12, 10, 8);
    lamp.fillStyle(0xf6b73c, 1);
    lamp.fillCircle(12, 10, 5);
    lamp.generateTexture('prop_lamp', 24, 48);
    lamp.destroy();

    // 5. Pond
    const pond = this.make.graphics({ x: 0, y: 0 });
    pond.fillStyle(0x3a2a1e, 0.8);
    pond.fillEllipse(60, 45, 116, 86);
    pond.fillStyle(0x7ccbea, 1);
    pond.fillEllipse(60, 45, 110, 80);
    pond.fillStyle(0xffffff, 0.4);
    pond.fillRoundedRect(35, 30, 30, 4, 2);
    pond.fillRoundedRect(65, 52, 24, 3, 1.5);
    pond.fillStyle(0x3e9b5e, 1);
    pond.fillCircle(45, 48, 5);
    pond.generateTexture('prop_pond', 124, 94);
    pond.destroy();
  }

  private createNpcTextures() {
    // 1. Tanish AI NPC (Town Square Companion with glowing cyber visor)
    const aiNpc = this.make.graphics({ x: 0, y: 0 });
    aiNpc.fillStyle(0x3a2a1e, 1);
    aiNpc.fillRoundedRect(4, 2, 20, 20, 10);
    aiNpc.fillRoundedRect(2, 18, 24, 26, 6);
    aiNpc.fillStyle(0xffdbb5, 1);
    aiNpc.fillRoundedRect(6, 8, 16, 12, 4);
    // Glowing cyan visor
    aiNpc.fillStyle(0x00f0ff, 1);
    aiNpc.fillRoundedRect(8, 11, 12, 4, 2);
    // Dark engineer hoodie
    aiNpc.fillStyle(0x111b2d, 1);
    aiNpc.fillRoundedRect(4, 20, 20, 16, 4);
    aiNpc.fillStyle(0x4f8cff, 1);
    aiNpc.fillRect(13, 20, 2, 16); // Accent zipper
    aiNpc.fillStyle(0x3a2a1e, 1);
    aiNpc.fillRect(6, 36, 6, 8);
    aiNpc.fillRect(16, 36, 6, 8);
    aiNpc.generateTexture('npc_tanish_ai', 28, 46);
    aiNpc.destroy();

    // 2. Librarian NPC
    const libNpc = this.make.graphics({ x: 0, y: 0 });
    libNpc.fillStyle(0x3a2a1e, 1);
    libNpc.fillRoundedRect(4, 2, 20, 20, 10);
    libNpc.fillRoundedRect(2, 18, 24, 26, 6);
    libNpc.fillStyle(0xffdbb5, 1);
    libNpc.fillRoundedRect(6, 8, 16, 12, 4);
    libNpc.fillStyle(0xe8804f, 1);
    libNpc.fillRoundedRect(4, 20, 20, 16, 4);
    libNpc.fillStyle(0x3a2a1e, 1);
    libNpc.fillRect(6, 36, 6, 8);
    libNpc.fillRect(16, 36, 6, 8);
    libNpc.generateTexture('npc_librarian', 28, 46);
    libNpc.destroy();

    // 3. Postmaster NPC
    const postNpc = this.make.graphics({ x: 0, y: 0 });
    postNpc.fillStyle(0x3a2a1e, 1);
    postNpc.fillRoundedRect(4, 2, 20, 20, 10);
    postNpc.fillRoundedRect(2, 18, 24, 26, 6);
    postNpc.fillStyle(0xffdbb5, 1);
    postNpc.fillRoundedRect(6, 8, 16, 12, 4);
    postNpc.fillStyle(0x266f73, 1);
    postNpc.fillRoundedRect(4, 20, 20, 16, 4);
    postNpc.fillStyle(0x3a2a1e, 1);
    postNpc.fillRect(6, 36, 6, 8);
    postNpc.fillRect(16, 36, 6, 8);
    postNpc.generateTexture('npc_postmaster', 28, 46);
    postNpc.destroy();
  }
}
