import Phaser from 'phaser';
import { gameConfig } from './config';

export function createGame(parentElement: HTMLElement): Phaser.Game {
  const config = {
    ...gameConfig,
    parent: parentElement,
  };
  return new Phaser.Game(config);
}
