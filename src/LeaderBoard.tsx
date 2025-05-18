//NOTE:
// Leaderboard is basically a todo app
// But without editing capabilities, which means there's zero reactivity
//
import { useCookies } from "react-cookie";

export interface LeaderboardEntry {
  key: string;
  name: string;
  score: number;
}

export function LeaderBoard() {
  const [cookies, _] = useCookies<
    "leaderboard",
    { leaderboard: LeaderboardEntry[] }
  >(["leaderboard"]);
  const leaderboard = cookies.leaderboard ?? [];
  return (
    <div className="page">
      <ul className="leaderboard">
        {leaderboard
          .sort(
            (entry1: LeaderboardEntry, entry2: LeaderboardEntry) =>
              entry2.score - entry1.score,
          )
          .map((entry: LeaderboardEntry, i: number) => (
            <li
              className={`leaderboard-item ${i === 0 ? "gold" : ""}`}
              key={entry.key}
            >
              <span className="leaderboard-name">
                #{i + 1} {entry.name}
              </span>
              <span className="leaderboard-score">{entry.score} pts</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
