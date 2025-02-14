import {EnemyObject} from "./Enemy.tsx";

function GameMap({enemies} : {enemies: EnemyObject[]}){
    return <div>I'm crawling with enemies. Enemy: {enemies[0].name}</div>
}

export {GameMap};

