import React from 'react';
import { ShoppingCart, User, Utensils, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar({
  cartCount,
  onCartToggle,
  user,
  onAuthToggle,
  onLogout,
  currentView,
  setView
}) {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <a href="#home" className="logo" onClick={() => setView('home')}>
          <Utensils size={28} />
          <span>MITS Canteen</span>
        </a>

        <ul className="nav-links">
          <li>
            <a href="#home" className={currentView === 'home' ? 'active' : ''} onClick={() => setView('home')}>Home</a>
          </li>
          <li>
            <a href="#menu" onClick={() => {
              setView('home');
              setTimeout(() => {
                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}>Menu</a>
          </li>
          <li>
            <a href="#popular" onClick={() => {
              setView('home');
              setTimeout(() => {
                document.getElementById('popular')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}>Popular Foods</a>
          </li>
          <li>
            <a href="#reviews" onClick={() => {
              setView('home');
              setTimeout(() => {
                document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}>Reviews</a>
          </li>
          <li>
            <a href="#contact" onClick={() => {
              setView('home');
              setTimeout(() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}>Contact</a>
          </li>
        </ul>

        <div className="nav-actions">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <button
                  className="btn btn-outline"
                  onClick={() => setView('admin-dashboard')}
                  title="Admin Dashboard"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <LayoutDashboard size={18} />
                  <span>Admin</span>
                </button>
              ) : (
                <button
                  className="btn btn-outline"
                  onClick={() => setView('student-profile')}
                  title="My Profile"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <User size={18} />
                  <span>{user.username}</span>
                </button>
              )}
              <button
                className="cart-trigger"
                onClick={onCartToggle}
                title="View Cart"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </button>
              <button
                className="action-btn delete"
                onClick={onLogout}
                title="Logout"
                style={{ marginLeft: '10px' }}
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <button
                className="cart-trigger"
                onClick={onCartToggle}
                title="View Cart"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </button>
              <button
                className="btn btn-primary"
                onClick={onAuthToggle}
                style={{ padding: '8px 20px', borderRadius: '20px' }}
              >
                <User size={16} />
                <span>Login</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
