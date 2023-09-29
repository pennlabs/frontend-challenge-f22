import React from 'react';

const Nav = () => {
  const scrollToCart = () => {
    const cartSection = document.getElementById('cart-section');
    
    if (cartSection) {
      cartSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      width: '100%',
      padding: '0 1rem',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    }}>
      <h2>Penn Course Cart</h2>
      <button onClick={scrollToCart}>Go to Cart</button>
    </div>
  );
}

export default Nav;
