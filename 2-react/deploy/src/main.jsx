import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Hangman from "./Hangman.jsx";
import Millonaire from "./Millionaire.jsx";
import Layout from "./Layout.jsx";
import Home from "./Home.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element:<Home/>
      },
      {
        path: "/hangman",
        element: <Hangman />,
      },
      {
        path: "/millionaire",
        element: <Millonaire />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
