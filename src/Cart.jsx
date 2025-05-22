import React, { useEffect } from 'react';

//enables a logged in user to view the products they add to the cart

function Cart({ cart, removeFromCart, handleCheckout, total, token, setCart }) {
  useEffect(() => {
    if (!token) {
      alert('Please log in to view cart.');
      return;
    } else {
      alert('Thank you for logging in');
    }
  }, [token]);

  const totalAmount = typeof total === 'number' ? total : 0;

  //login users can see the quanatity of cookies they have added to the cart and remove cookies from cart
  return (
    <div>
      <h1>Your Cart 🛒</h1>
      {cart.length === 0 ? (
        <p>No cookies in cart.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} x {item.quantity}
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
           <p>Total: ${totalAmount.toFixed(2)}</p>
          <button onClick={() => {
            handleCheckout();
            setCart([]);
          }}>
            Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;

