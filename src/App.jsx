import * as React from "react";
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./styles/globals.css";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-dark-blue/theme.css";
import Root from "./views/Root.jsx";
import Login from "./views/Login.jsx";
import WindowTopbar from "./components/WindowTopbar.jsx";
import Dashboard from "./views/Dashboard.jsx";
import Logout from "./views/Logout.jsx";
import Top from "./views/Top.jsx";
import Stats from "./views/Stats.jsx";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/top",
        element: <Top />
      },
      {
        path: "/stats",
        element: <Stats />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/logout",
    element: <Logout />
  }
]);

const root = createRoot(document.getElementById("app"));

root.render(
  <React.StrictMode>
    <WindowTopbar />
    <main className="flex" style={{paddingTop: '33px'}}>
      <RouterProvider router={router} />
    </main>
  </React.StrictMode>
);