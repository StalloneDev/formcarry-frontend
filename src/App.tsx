import { ChakraProvider, Container } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Products } from './pages/Products'
import { Cart } from './pages/Cart'
import { Dashboard as VendorDashboard } from './pages/vendor/Dashboard'
import { VendorRoute } from './components/VendorRoute'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { Home } from './pages/Home' // Corrected import statement
import theme from './theme'
import './App.css'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Navigation />
            <Container maxW="container.xl" py={8}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/vendor/*"
                  element={
                    <VendorRoute>
                      <VendorDashboard />
                    </VendorRoute>
                  }
                />
              </Routes>
            </Container>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
