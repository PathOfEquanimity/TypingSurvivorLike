class PlayerObject {
    private _name: string;
    private _word: string;
    private _score: number;
    private _lifeBar: number;
    private _x: number;
    private _y: number;

    constructor(name: string, word: string, score: number, lifeBar: number, x: number, y: number) {
        this._name = name;
        this._word = word;
        this._score = score;
        this._lifeBar = lifeBar;
        this._x = x;
        this._y = y;
    }

    get name() {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get word() {
        return this._word;
    }

    set word(value: string) {
        this._word = value;
    }

    get score() {
        return this._score;
    }

    set score(value: number) {
        this._score = value;
    }

    get lifeBar() {
        return this._lifeBar;
    }

    set lifeBar(value: number) {
        this._lifeBar = value;
    }

    get x() {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }
}

function updateScore(player: PlayerObject, newScore: number): PlayerObject {
    player.score = newScore;
    return player;
}

function updateLifeBar(player: PlayerObject, newLifeBar: number): PlayerObject {
    player.lifeBar = newLifeBar;
    return player;
}

function updateCoordinates(player: PlayerObject, newX: number, newY: number): PlayerObject {
    player.x = newX;
    player.y = newY;
    return player;
}

export {
    updateScore,
    updateLifeBar,
    updateCoordinates,
    PlayerObject 
}
