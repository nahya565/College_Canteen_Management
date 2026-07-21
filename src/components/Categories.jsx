import React from 'react';

export const categoriesList = [
  { id: 'Breakfast', name: 'Breakfast', icon: '🍽️', desc: '7:30 AM - 11:00 AM' },
  { id: 'Lunch', name: 'Lunch', icon: '🍛', desc: '12:00 PM - 3:00 PM' },
  { id: 'Snacks', name: 'Snacks & Fast Food', icon: '🍟', desc: 'All Day' },
  { id: 'Beverages', name: 'Drinks & Beverages', icon: '🥤', desc: 'Hot & Cold' },
  { id: 'Milkshakes', name: 'Milkshakes', icon: '🥛', desc: 'Thick & Creamy' },
  { id: 'Popular', name: 'Popular Items', icon: '⭐', desc: 'Student Favorites' }
];

export default function Categories({ activeCategory, onSelectCategory }) {
  return (
    <section className="section" id="categories" style={{ backgroundColor: '#fff' }}>
      <div className="container">
        <h2 className="section-title">Browse Categories</h2>
        <p className="section-subtitle">Choose from our wide variety of authentic Indian cuisines and fast foods</p>
        
        <div className="categories-grid">
          {categoriesList.map((cat) => (
            <div
              key={cat.id}
              className={`category-card ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                onSelectCategory(cat.id);
                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="category-icon">{cat.icon}</span>
              <h3>{cat.name}</h3>
              <p style={{ fontSize: '0.8rem', color: '#7D6B67', marginTop: '4px' }}>{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
