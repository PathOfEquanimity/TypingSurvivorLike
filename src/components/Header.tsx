import { ReactNode } from "react";
import Link from "next/link";

export function Header({ children }: { children: ReactNode }) {
  return (
    <>
      <div>
        <ul className="nav-links">
          <li>
            <Link href="/game">Game</Link>
          </li>
          <li>
            <Link href="/leaderboard">Leaderboard</Link>
          </li>
        </ul>
      </div>
      {children}
    </>
  );
}
