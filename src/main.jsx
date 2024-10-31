import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./authentication/Login.jsx";
import Signup from "./authentication/SignUp.jsx";
import HomePage from "./components/home/HomePage.jsx";
import "./index.css";
import ProductDetails from "./components/ProductDetails .jsx";
import SearchResults from "./components/SearchByTitle.jsx";
const router = createBrowserRouter([
  
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  { path: "products/:productId", element: <ProductDetails /> },

  
 {path :"search/:title", element: <SearchResults />}
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
