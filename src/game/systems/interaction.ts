import { Place } from '../../data/places';

export class InteractionSystem {
  private activeZone: Place | null = null;

  public getActiveZone(): Place | null {
    return this.activeZone;
  }

  public setActiveZone(zone: Place | null): void {
    this.activeZone = zone;
  }
}
