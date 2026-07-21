import React from 'react';
import { ArrowRight, UtensilsCrossed } from 'lucide-react';

export default function Hero({ onOrderNowClick }) {
  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-content">
          <span className="hero-tag">
            <UtensilsCrossed size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Premium Campus Dining
          </span>
          <h1>Skip the Queue.<br />Pre-Book Your <span>Favorite Food</span> Online.</h1>
          <p className="hero-subtitle">
            Fresh • Hygienic • Affordable • Ready on Time
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={onOrderNowClick}>
              <span>Order Now</span>
              <ArrowRight size={18} />
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>View Menu</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
