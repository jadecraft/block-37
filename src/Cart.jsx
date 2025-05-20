import React from 'react';

function Cart({ cart, removeFromCart }) {
  return (
    <div>
      <h1>Your Cart 🛒</h1>
      {cart.length === 0 ? (
        <p>No cookies in cart.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} x {item.quantity}
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Cart;
