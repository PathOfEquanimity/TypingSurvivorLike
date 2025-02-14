type EnemyStatus = 'inactive' | 'active' | 'destroyed';

interface EnemyObject {
  name: string;
  word: string;
  moves_towards_player: boolean;
  status: EnemyStatus;
  x: number;
  y: number;
}

class Enemy {
  private _name: string;
  private _word: string;
  private _moves_towards_player: boolean;
  private _status: EnemyStatus;
  private _x: number;
  private _y: number;

  constructor(name: string, word: string, moves_towards_player: boolean, status: EnemyStatus, x: number, y: number) {
    this._name = name;
    this._word = word;
    this._moves_towards_player = moves_towards_player;
    this._status = status;
    this._x = x;
    this._y = y;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get word(): string {
    return this._word;
  }

  set word(value: string) {
    this._word = value;
  }

  get moves_towards_player(): boolean {
    return this._moves_towards_player;
  }

  set moves_towards_player(value: boolean) {
    this._moves_towards_player = value;
  }

  get status(): EnemyStatus {
    return this._status;
  }

  set status(value: EnemyStatus) {
    this._status = value;
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }
}

export {
  Enemy,
  type EnemyObject,
  type EnemyStatus
};
