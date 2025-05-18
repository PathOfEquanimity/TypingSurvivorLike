import { Link, NavLink } from "react-router";

export function Header({ children }: { children: any }) {
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
