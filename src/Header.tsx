import { ReactNode } from "react";
import { NavLink } from "react-router";

export function Header({ children }: { children: ReactNode }) {
  return (
    <>
      <div>
        <ul className="nav-links">
          <li>
            <NavLink to="/">Game</NavLink>
          </li>
          <li>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
          </li>
        </ul>
      </div>
      {children}
    </>
  );
}
