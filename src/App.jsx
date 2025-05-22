import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './register';
import Login from './login';
import Cookies from './Cookies';
import Cart from './Cart';
import Navbar from './Navigations';

function App() {
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState([]);

  const addToCart = (cookie) => {
    const existing = cart.find((item) => item.id === cookie.id);
    if (existing) {
      setCart(cart.map((item) =>
        item.id === cookie.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...cookie, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
  if (!token) {
    alert('Please log in to check out.');
    return;
  }
  alert('Thank you for your purchase!');
  setCart([]);
};

 const total = () => {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};




  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Cookies addToCart={addToCart} />} />
      <Route path='/cart' element={<Cart cart={cart} removeFromCart={removeFromCart} handleCheckout={handleCheckout} total={total}/>} />
        <Route path='/register' element={<Register setToken={setToken} />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
