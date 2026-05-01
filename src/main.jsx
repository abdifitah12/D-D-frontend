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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "contact", element: <Contact /> },
      { path: "events", element: <Events /> },
      { path: "admin/login", element: <AdminLogin /> },
      { path: "admin/events", element: <AdminEvents /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
