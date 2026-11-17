import Phaser from 'phaser';

export class CameraSystem {
  public static setup(camera: Phaser.Cameras.Scene2D.Camera, worldWidth: number, worldHeight: number): void {
    camera.setBounds(0, 0, worldWidth, worldHeight);
    camera.setRoundPixels(true);
  }
}
