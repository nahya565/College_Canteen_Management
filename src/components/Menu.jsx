import React, { useState } from 'react';
import { Search, Star, Plus, Minus } from 'lucide-react';

export default function Menu({
  items,
  cartItems,
  onAddToCart,
  onUpdateQty,
  activeCategory,
  onSelectCategory
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Search & Category Filtering
  const filteredItems = items.filter((item) => {
    // Match search query
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Match category
    let matchesCategory = true;
    if (activeCategory === 'Popular') {
      matchesCategory = item.is_popular;
    } else if (activeCategory !== 'All') {
      matchesCategory = item.category === activeCategory;
    }

    return matchesSearch && matchesCategory;
  });

  const getCartItem = (itemId) => {
    return cartItems.find(cartItem => cartItem.id === itemId);
  };

  return (
    <section className="section" id="menu">
      <div className="container">
        <h2 className="section-title">Explore Our Menu</h2>
        <p className="section-subtitle">Freshly prepared, hygienic, and affordable meals pre-booked for you.</p>

        <div className="menu-controls">
          {/* Search Bar */}
          <div className="search-bar-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder='Search foods (e.g. "Dosa", "Biryani", "Tea")...'
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Tabs */}
          <div className="menu-tabs">
            {['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages', 'Milkshakes', 'Popular'].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeCategory === tab ? 'active' : ''}`}
                onClick={() => onSelectCategory(tab)}
              >
                {tab === 'Beverages' ? 'Drinks & Beverages' : tab === 'Popular' ? '⭐ Popular' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        {filteredItems.length > 0 ? (
          <div className="menu-grid">
            {filteredItems.map((item) => {
              const cartItem = getCartItem(item.id);
              return (
                <div className="food-card animate-card" key={item.id}>
                  <div className={`food-badge ${item.is_veg ? 'badge-veg' : 'badge-nonveg'}`}>
                    <span className={item.is_veg ? 'veg-dot' : 'nonveg-dot'}></span>
                    <span>{item.is_veg ? 'VEG' : 'NON-VEG'}</span>
                  </div>

                  <div className="food-img-container">
                    <img
                      src={item.image_url || "/images/pongal.jpg"}
                      alt={item.name}
                      className="food-img"
                      loading="lazy"
                      onError={(e) => {
                        console.log("Broken image:", item.name, item.image_url);
                        e.target.src = "/images/pongal.jpg";
                      }}
                    />
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
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#7D6B67' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>No food items match your filters.</p>
            <p style={{ fontSize: '0.9rem' }}>Try modifying your search or choosing another category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
