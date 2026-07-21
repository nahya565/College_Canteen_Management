import React from 'react';
import { Star, Plus, Minus } from 'lucide-react';

export default function PopularItems({
  items,
  cartItems,
  onAddToCart,
  onUpdateQty
}) {
  const popularItemsList = items.filter(item => item.is_popular);

  const getCartItem = (itemId) => {
    return cartItems.find(cartItem => cartItem.id === itemId);
  };

  return (
    <section className="section" id="popular">
      <div className="container">
        <h2 className="section-title">⭐ Popular Items</h2>
        <p className="section-subtitle">The absolute crowd-favorites at our canteen. Skip the queue by pre-booking them now!</p>

        <div className="menu-grid">
          {popularItemsList.map((item) => {
            const cartItem = getCartItem(item.id);
            return (
              <div className="food-card animate-card" key={item.id}>
                <div className={`food-badge ${item.is_veg ? 'badge-veg' : 'badge-nonveg'}`}>
                  <span className={item.is_veg ? 'veg-dot' : 'nonveg-dot'}></span>
                  <span>{item.is_veg ? 'VEG' : 'NON-VEG'}</span>
                </div>
                
                <div className="food-img-container">
                  <img src={item.image_url} alt={item.name} className="food-img" loading="lazy" />
                </div>

                <div className="food-details">
                  <div className="food-header">
                    <h3 className="food-title">{item.name}</h3>
                    <span className="food-price">₹{item.price}</span>
                  </div>

                  <p className="food-description">{item.description}</p>

                  <div className="food-footer">
                    <div className="rating-container">
                      <Star size={14} fill="currentColor" />
                      <span>{item.rating}</span>
                    </div>

                    {!item.is_available ? (
                      <span style={{ color: '#C62828', fontWeight: 600, fontSize: '0.9rem' }}>Out of Stock</span>
                    ) : cartItem ? (
                      <div className="qty-controls">
                        <button className="qty-btn" onClick={() => onUpdateQty(item.id, cartItem.qty - 1)}>-</button>
                        <span className="qty-number">{cartItem.qty}</span>
                        <button className="qty-btn" onClick={() => onUpdateQty(item.id, cartItem.qty + 1)}>+</button>
                      </div>
                    ) : (
                      <button className="btn btn-primary" onClick={() => onAddToCart(item)} style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem' }}>
                        <Plus size={16} />
                        <span>Add to Cart</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
