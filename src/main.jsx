import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./authentication/Login.jsx";
import Signup from "./authentication/SignUp.jsx";
import HomePage from "./components/home/HomePage.jsx";
import "./index.css";
import ProductDetails from "./components/ProductDetails.jsx";
import { CartProvider, useCart } from "./components/home/CartContext";
import Cart from "./components/home/Cart.jsx";
import SearchResults from "./components/SearchByTitle.jsx";
import Dashboard from "./components/home/Dashboard.jsx";
import Order from "./components/Order.jsx";
import Wishlist from "./components/home/Wishlist.jsx";
import AdminDashboard from "./components/home/AdminDashboard.jsx";
import ChatComponent from "./components/Chat.jsx";

const AppWrapper = () => {
  const { userId } = useCart();

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
    {
      path: "products/:productId",
      element: <ProductDetails />,
    },
    {
      path: "/cart",
      element: <Cart />,
    },
    {
      path: "search/:title",
      element: <SearchResults />,
    },
    {
      path: "/checkout",
      element: <Order />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/chat",
      element: <ChatComponent />,
    },
    {
      path: "/wishlist",
      element: <Wishlist />,
    },
    {
      path: "/admin",
      element: <AdminDashboard />,
    },
  ]);

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
};

createRoot(document.getElementById("root")).render(
  <CartProvider>
    <AppWrapper />
  </CartProvider>
);