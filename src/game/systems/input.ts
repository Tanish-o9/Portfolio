export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  interact: boolean;
}

export class InputSystem {
  public state: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    interact: false,
  };
}
