"use client";
//NOTE:
// Leaderboard is basically a todo app
// But without editing capabilities, which means there's zero reactivity
//
import { useEffect, useState } from "react";
import { LeaderboardEntry } from "@/utils/leaderboard";
import { fetchAllScores } from "app/action";
import Loading from "@/components/Loading";
import Error from "@/components/Error";

export default function LeaderBoard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leaderboardRows, setLeaderboardRows] = useState<LeaderboardEntry[]>(
    [],
  );
  useEffect(() => {
    (async () => {
      setError(null);
      try {
        const res = await fetchAllScores();
        setLeaderboardRows(
          res.map((e) => ({ key: e.id, name: e.username, score: e.score })),
        );
      } catch {
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  if (loading == true) {
    return <Loading />;
  }
  if (error != null) {
    return <Error message={"Couldn't fetch leaderboard data"} />;
  }
  return (
    <div className="page">
      <ul className="leaderboard">
        {leaderboardRows
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
