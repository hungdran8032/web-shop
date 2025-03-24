
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

// Pages
import Home from "./pages/Home"
import ProductDetail from "./pages/ProductDetail"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Cart from "./pages/Cart"
import AdminProductManagement from "./pages/admin/AdminProductManagement"
import AdminCategoryManagement from "./pages/admin/AdminCategoryManagement"
import ProductsPage from "./pages/ProductPages"
import NotFound from "./pages/NotFound"
import UserOrders from "./pages/UserOrders"
import OrderDetail from "./pages/OrderDetail"
import AdminOrders from "./pages/admin/AdminOrders"
import Checkout from "./pages/Checkout"

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#fff",
    },
    secondary: {
      main: "#f50057",
      light: "#ff4081",
      dark: "#c51162",
      contrastText: "#fff",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          overflow: "hidden",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
})

function App() {


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* User Orders */}
          <Route path="/orders" element={<UserOrders />} />
          <Route path="/order/:orderId" element={<OrderDetail />} />
          {/* Admin routes */}
          <Route path="/admin/products" element={<AdminProductManagement />} />
          <Route path="/admin/categories" element={<AdminCategoryManagement />} />
          <Route path="/admin/orders" element={<AdminOrders />} />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>


  )
}

export default App

