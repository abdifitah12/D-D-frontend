import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import Contact from "./pages/Contact.jsx";
import Events from "./pages/Events.jsx";
import AdminEvents from "./pages/AdminEvents.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import EventHistory from "./pages/EventHistory.jsx";
import AdminEventHistory from "./pages/AdminEventHistory.jsx";
import LivePage from "./pages/LivePage.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },

      { path: "products", element: <Products /> },

      { path: "contact", element: <Contact /> },

      { path: "events", element: <Events /> },

      { path: "events/history", element: <EventHistory /> },

      { path: "live", element: <LivePage /> },

      // PUBLIC ADMIN LOGIN
      {
        path: "admin/login",
        element: <AdminLogin />,
      },

      // PROTECTED ADMIN EVENTS
      {
        path: "admin/events",
        element: (
          <ProtectedRoute>
            <AdminEvents />
          </ProtectedRoute>
        ),
      },

      // PROTECTED ADMIN EVENT HISTORY
      {
        path: "admin/event-history",
        element: (
          <ProtectedRoute>
            <AdminEventHistory />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);