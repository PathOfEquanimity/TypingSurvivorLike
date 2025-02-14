import { useState, useEffect } from "react";
import { EnemyObject } from "./EnemyObject.tsx";
import { PlayerObject } from "./PlayerObject.tsx";

const DAMAGE = 10;

function GameMap({ enemies, player, gridSize }: { enemies: EnemyObject[], player: PlayerObject, gridSize: number }) {
    const [enemyPositions, setEnemyPositions] = useState<{ x: number, y: number }[]>([]);
    const [playerHealth, setPlayerHealth] = useState(player.health);

    useEffect(() => {
        const positions = enemies.map(() => ({
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize),
        }));
        setEnemyPositions(positions);
        const interval = setInterval(() => {
            setEnemyPositions(prevPositions => {
                return prevPositions.map((pos, index) => {
                    if (index === 0) { // Move one enemy at a time
                        const dx = player.x - pos.x;
                        const dy = player.y - pos.y;
                        if (Math.abs(dx) > Math.abs(dy)) {
                            return { x: pos.x + Math.sign(dx), y: pos.y };
                        } else {
                            return { x: pos.x, y: pos.y + Math.sign(dy) };
                        }
                    }
                    return pos;
                });
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [player]);

    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridSize}, 50px)`, gap: "5px" }}>
                {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                    const x = index % gridSize;
                    const y = Math.floor(index / gridSize);
                    const enemyIndex = enemyPositions.findIndex(pos => pos.x === x && pos.y === y);
                    const isPlayer = player.x === x && player.y === y;
                    return (
                        <div key={index} style={{ width: "50px", height: "50px", border: "1px solid black", backgroundColor: isPlayer ? "green" : enemyIndex !== -1 ? "red" : "transparent" }}>
                            {isPlayer ? player.name : enemyIndex !== -1 ? "Enemy" : ""}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export { GameMap };
