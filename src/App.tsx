import "./App.css";
import { Game } from "./Game";
import { Header } from "./Header.tsx";
import { LeaderBoard } from "./LeaderBoard.tsx";
import { BrowserRouter, Routes, Route } from "react-router";

const ROUTES = [
  { path: "/", element: <Game /> },
  { path: "/leaderboard", element: <LeaderBoard /> },
  { path: "*", element: <p>Path not resovled</p> },
];

function App() {
  const basename = import.meta.env.BASE_URL;
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        {ROUTES.map((route, i) => {
          return (
            <Route
              key={i}
              path={route.path}
              element={<Header>{route.element}</Header>}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export { App };
