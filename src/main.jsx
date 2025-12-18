import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
// import About from "./pages/About.jsx";
 import Contact from "./pages/Contact.jsx";
// import Location from "./pages/Location.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      // { path: "about", element: <About /> },
       { path: "contact", element: <Contact /> },
      // { path: "location", element: <Location /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
