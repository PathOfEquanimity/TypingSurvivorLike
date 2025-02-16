import { useState, useEffect } from "react";
import { EnemyObject } from "./EnemyObject.tsx";
import { PlayerObject } from "./PlayerObject.tsx";

const DAMAGE = 10;

function GameMap({
    enemies,
    player,
    gridSize,
}: {
    enemies: EnemyObject[];
    player: PlayerObject;
    gridSize: number;
}) {
    const [enemyPositions, setEnemyPositions] = useState<EnemyObject[]>(enemies);
    const [word, setWord] = useState<string>("");
    const [enemyName, setEnemyName] = useState<string>("");
    useEffect(() => {
        
    }, [enemyPositions, player.lifeBar]);
    useEffect(() => {
        setEnemyPositions(enemies);
    const interval = setInterval(() => {
        setEnemyPositions(prevPositions => {
            const activeEnemy = prevPositions.find(pos => pos.status === 'active') || prevPositions.find(pos => pos.status === 'inactive');
            if (!activeEnemy) return prevPositions;

            setWord(activeEnemy.word);
            setEnemyName(activeEnemy.name);

            if (activeEnemy.status === 'inactive') {
                activeEnemy.status = 'active';
            }

            const dx = player.x - activeEnemy.x;
            const dy = player.y - activeEnemy.y;

            if (Math.abs(dx) > Math.abs(dy)) {
                activeEnemy.x += Math.sign(dx);
            } else {
                activeEnemy.y += Math.sign(dy);
            }

            if (activeEnemy.x === player.x && activeEnemy.y === player.y && activeEnemy.status === 'active') {
                player.lifeBar -= DAMAGE;
                activeEnemy.status = 'destroyed';
                console.log("Player life bar:", player.lifeBar, activeEnemy.status);
            }

            const updatedPositions = prevPositions.map(p => 
                p.name === activeEnemy.name ? { ...activeEnemy, status: activeEnemy.status } : p
            );
            console.log("Updated positions:", updatedPositions);

            const allEnemiesDestroyed = updatedPositions.every(enemy => enemy.status === 'destroyed');
            if (allEnemiesDestroyed && player.lifeBar <= 70) {
                alert("Game Over");
            }
        console.log(enemyPositions)
        const allEnemiesDestroyedByPlayer = updatedPositions.some(enemy => enemy.status === 'destroyedbyplayer') && updatedPositions.every(enemy => enemy.status === 'destroyed' || enemy.status === 'destroyedbyplayer');
        if (allEnemiesDestroyedByPlayer ) {
            alert("Victory");
            setEnemyPositions(prevPositions => 
                prevPositions.map(enemy => ({ ...enemy, status: 'active' }))
            );
            window.location.reload();
        }
        const checkGameStatus = (updatedPositions: EnemyObject[]) => {
            if (allEnemiesDestroyed && player.lifeBar > 70) {
            alert("Victory");
            setEnemyPositions(prevPositions => 
                prevPositions.map(enemy => ({ ...enemy, status: 'active' }))
            );
            window.location.reload();
            }
        };
        return updatedPositions;
        });
    }, 1000);

        return () => clearInterval(interval);
    }, [player, enemies]);


    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if((e.target as HTMLInputElement).value === word){
            setEnemyPositions(prevPositions => 
                prevPositions.map(enemy => 
                    enemy.name === enemyName ? { ...enemy, status: 'destroyedbyplayer' } : enemy
                )
            );
            e.target.value = "";
            console.log("Enemy destroyed:", enemyName);
        const allEnemiesDestroyedByPlayer = updatedPositions.some(enemy => enemy.status === 'destroyedbyplayer') && updatedPositions.every(enemy => enemy.status === 'destroyed' || enemy.status === 'destroyedbyplayer');
        if (allEnemiesDestroyedByPlayer ) {
            alert("Victory");
            setEnemyPositions(prevPositions => 
                prevPositions.map(enemy => ({ ...enemy, status: 'active' }))
            );
            window.location.reload();
        }
        }
    };

    return (
        <div>
            <div style={lifeBarStyle}>
                <div style={{ ...lifeBarFillStyle, width: `${player.lifeBar}%` }}></div>
                <span style={lifeBarTextStyle}>{player.lifeBar}%</span>
            </div>
            <div style={wordInputContainerStyle}>
                <div style={wordDisplayStyle}>{word}</div>
                <input 
                    type="text" 
                    onKeyUp={handleKeyPress} 
                    style={wordInputStyle} 
                />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridSize}, 50px)`, gap: "5px" }}>
                {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                    const x = index % gridSize; 
                    const y = Math.floor(index / gridSize);
                    const enemyIndex = enemyPositions.findIndex(pos => pos.x === x && pos.y === y && (pos.status === "inactive" || pos.status === "active"));
                    const isPlayer = player.x === x && player.y === y;
                    return (
                        <div key={index} style={{ ...cellStyle, backgroundColor: isPlayer ? "green" : enemyIndex !== -1 ? "red" : "transparent" }}>
                            {isPlayer ? player.name : enemyIndex !== -1 ? (
                                <>
                                    <div>{enemies[enemyIndex].name}</div>
                                    <div>{enemies[enemyIndex].word}</div>
                                </>
                            ) : ""}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const lifeBarStyle = {
    position: "absolute",
    top: "10px",
    left: "10px",
    width: "200px",
    height: "20px",
    border: "2px solid white",
    backgroundColor: "red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
};

const lifeBarFillStyle = {
    height: "100%",
    backgroundColor: "red",
    position: "absolute",
    left: 0,
    top: 0,
};

const lifeBarTextStyle = {
    position: "relative",
    zIndex: 1,
};

const cellStyle = {
    width: "50px",
    height: "50px",
    border: "1px solid black",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
};

const wordInputContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "10px",
};

const wordDisplayStyle = {
    marginBottom: "5px",
    fontSize: "20px",
    fontWeight: "bold",
};

const wordInputStyle = {
    padding: "5px",
    fontSize: "16px",
};

export { GameMap };
