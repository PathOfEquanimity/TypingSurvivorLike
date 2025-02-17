enum Status {
  Active,
  Inactive,
  Disabled,
  Hero,
}

interface Pos {
  y: number;
  x: number;
}

interface EnemyObject {
  name: string;
  position: Pos;
  status: Status;
  word: string;
  focus: boolean;
  typedWord?: string;
}

function Enemy() {
  return <p>Hello world</p>;
}

export { Enemy, type EnemyObject, type Pos, Status };
