import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import PopularItems from './components/PopularItems';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { menuData } from './data/menuData';
import { apiService } from './services/api';
import { Star, Award, Smile, ShieldCheck, MapPin, Clock, Phone, Mail } from 'lucide-react';

export default function App() {
  const [menuItems, setMenuItems] = useState(menuData);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [currentView, setView] = useState('home'); // home, student-profile, admin-dashboard
  const [activeCategory, onSelectCategory] = useState('All');
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState([
    {
      id: 1001,
      username: "Aditya Verma",
      email: "aditya.v@mits.edu",
      phone: "9840123456",
      items: [
        { name: "Chicken Biryani", price: 170, qty: 1 },
        { name: "Chocolate Milkshake", price: 90, qty: 1 }
      ],
      subtotal: 260,
      gst: 13,
      grand_total: 273,
      status: "completed",
      date: "2026-07-18"
    },
    {
      id: 1002,
      username: "Priya Nair",
      email: "priya.n@mits.edu",
      phone: "9952345678",
      items: [
        { name: "Plain Dosa", price: 40, qty: 1 },
        { name: "Tea", price: 15, qty: 1 }
      ],
      subtotal: 55,
      gst: 3,
      grand_total: 58,
      status: "ready",
      date: "2026-07-18"
    },
    {
      id: 1003,
      username: "Rohan Sharma",
      email: "rohan.s@mits.edu",
      phone: "9765432109",
      items: [
        { name: "Pizza", price: 150, qty: 1 },
        { name: "Coca-Cola", price: 40, qty: 1 }
      ],
      subtotal: 190,
      gst: 10,
      grand_total: 200,
      status: "preparing",
      date: "2026-07-18"
    }
  ]);

  // Load menu items from server on mount
  useEffect(() => {
    async function loadMenu() {
      const serverMenu = await apiService.getMenu();

      if (serverMenu && serverMenu.length > 0) {
        const formattedMenu = serverMenu.map(m => ({
          ...m,
          price: Number(m.price),
          rating: Number(m.rating)
        }));
        setMenuItems(formattedMenu);
      }
    }
    loadMenu();
  }, []);

  // Sync orders with backend if logged in
  useEffect(() => {
    if (token) {
      async function loadOrders() {
        const serverOrders = await apiService.getOrders(token);
        if (serverOrders) {
          const formatted = serverOrders.map(o => ({
            id: o.id,
            username: o.username,
            email: o.email,
            items: typeof o.items_json === 'string' ? JSON.parse(o.items_json) : o.items_json,
            subtotal: Number(o.subtotal),
            gst: Number(o.gst),
            grand_total: Number(o.grand_total),
            status: o.status,
            date: new Date(o.created_at).toISOString().split('T')[0]
          }));
          setOrders(formatted);
        }
      }
      loadOrders();
    }
  }, [token, user]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Cart operations
  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const exists = prev.find((it) => it.id === item.id);
      if (exists) {
        return prev.map((it) => (it.id === item.id ? { ...it, qty: it.qty + 1 } : it));
      }
      showToast(`${item.name} added to cart!`);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleUpdateQty = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, qty: newQty } : item))
    );
  };

  const handleRemoveItem = (itemId) => {
    const item = cartItems.find((it) => it.id === itemId);
    if (item) {
      showToast(`${item.name} removed from cart`, 'error');
    }
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Authentication triggers
  const handleLoginSuccess = async (userData, token) => {
    setUser(userData);

    setToken(token);

    localStorage.setItem("token", token);

    showToast(`Welcome back, ${userData.username}!`);

    if (userData.role === "admin") {
      setView("admin-dashboard");
    } else {
      setView("home");
    }
  }

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    showToast(`Account successfully verified! Welcome, ${userData.username}!`);
    setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setView('home');
    setCartItems([]);
    showToast("Logged out successfully.");
  };

  // Pre-booking Checkout
  const handleCheckout = async () => {
    if (!user) {
      setCartOpen(false);
      setAuthOpen(true);
      showToast("Please login as a student to pre-book food.", "error");
      return;
    }

    if (user.role === 'admin') {
      showToast("Admin staff accounts cannot pre-book food.", "error");
      return;
    }

    setLoading(true);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const gst = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + gst;

    const orderData = {
      items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      subtotal,
      gst,
      grand_total: grandTotal
    };

    // Try posting to Django
    let backendOrder = null;
    console.log("Token:", token);
    backendOrder = await apiService.createOrder(orderData, token);
    console.log("Backend Order:", backendOrder);

    if (backendOrder) {
      const formattedOrder = {
        id: backendOrder.id,
        username: user.username,
        email: user.email,
        items: typeof backendOrder.items_json === 'string' ? JSON.parse(backendOrder.items_json) : backendOrder.items_json,
        subtotal: Number(backendOrder.subtotal),
        gst: Number(backendOrder.gst),
        grand_total: Number(backendOrder.grand_total),
        status: backendOrder.status,
        date: new Date(backendOrder.created_at).toISOString().split('T')[0]
      };
      setOrders(prev => [formattedOrder, ...prev]);
      showToast("Pre-booking confirmed on database!");
    } else {
      // Fallback local mock ordering
      const mockOrder = {
        id: Math.floor(1000 + Math.random() * 9000),
        username: user.username,
        email: user.email,
        phone: user.phone || '9999999999',
        items: orderData.items,
        subtotal,
        gst,
        grand_total: grandTotal,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      };
      setOrders(prev => [mockOrder, ...prev]);
      showToast("Pre-booking confirmed (Offline Mode)!");
    }

    setCartItems([]);
    setCartOpen(false);
    setLoading(false);
    setView('student-profile');
  };

  // Order status updates
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    let success = false;
    if (token) {
      const updated = await apiService.updateOrderStatus(orderId, newStatus, token);
      if (updated) success = true;
    }

    // Always sync local state for responsive UI
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
    showToast(`Order #${orderId} updated to ${newStatus}`);
  };

  // Menu management CRUD (with API sync & local fallback)
  const handleAddMenuItem = async (item) => {
    let serverItem = null;
    if (token) {
      serverItem = await apiService.addMenuItem(item, token);
    }

    if (serverItem) {
      setMenuItems(prev => [{ ...serverItem, price: Number(serverItem.price), rating: Number(serverItem.rating) }, ...prev]);
    } else {
      const newItem = {
        ...item,
        id: menuItems.length > 0 ? Math.max(...menuItems.map(m => m.id)) + 1 : 1
      };
      setMenuItems(prev => [newItem, ...prev]);
    }
    showToast(`${item.name} added to menu!`);
  };

  const handleEditMenuItem = async (updatedItem) => {
    let success = false;
    if (token) {
      const serverItem = await apiService.updateMenuItem(updatedItem, token);
      if (serverItem) success = true;
    }

    setMenuItems(prev =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    showToast(`Successfully updated ${updatedItem.name}`);
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (token) {
      await apiService.deleteMenuItem(itemId, token);
    }

    const item = menuItems.find((it) => it.id === itemId);
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
    showToast(`${item?.name || 'Item'} deleted from menu`, 'error');
  };

  const handleToggleAvailability = async (itemId) => {
    const item = menuItems.find(it => it.id === itemId);
    if (!item) return;

    const nextState = !item.is_available;
    if (token) {
      await apiService.updateMenuItem({ ...item, is_available: nextState }, token);
    }

    setMenuItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, is_available: nextState } : it))
    );
    showToast(`${item.name} is now ${nextState ? 'In Stock' : 'Out of Stock'}`, nextState ? 'success' : 'error');
  };

  return (
    <div>
      {/* Loading Overlay */}
      {loading && (
        <div className="loader-overlay">
          <div className="spinner"></div>
          <span style={{ marginLeft: '12px', fontWeight: 600 }}>Processing Booking...</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        cartCount={cartItems.reduce((sum, item) => sum + item.qty, 0)}
        onCartToggle={() => setCartOpen(true)}
        user={user}
        onAuthToggle={() => setAuthOpen(true)}
        onLogout={handleLogout}
        currentView={currentView}
        setView={setView}
      />

      {/* Main Views */}
      {currentView === 'home' ? (
        <>
          <Hero onOrderNowClick={() => {
            document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
          }} />

          <Categories
            activeCategory={activeCategory}
            onSelectCategory={onSelectCategory}
          />

          <PopularItems
            items={menuItems}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onUpdateQty={handleUpdateQty}
          />

          <Menu
            items={menuItems}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onUpdateQty={handleUpdateQty}
            activeCategory={activeCategory}
            onSelectCategory={onSelectCategory}
          />

          {/* Why Choose Us */}
          <section className="section" style={{ backgroundColor: '#fff' }}>
            <div className="container">
              <h2 className="section-title">👨🍳 Why Choose Our Canteen?</h2>
              <p className="section-subtitle">We serve high-quality authentic Indian food with modern student convenience.</p>

              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <Award size={32} />
                  </div>
                  <h3>Freshly Cooked Food</h3>
                  <p>Prepared daily in clean copper utensils using authentic whole spices and ingredients.</p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <Clock size={32} />
                  </div>
                  <h3>Quick Pickup</h3>
                  <p>Pre-book online and walk directly to the checkout counter when your order ticket status marks ready.</p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <Smile size={32} />
                  </div>
                  <h3>Affordable Prices</h3>
                  <p>Student-friendly pricing matched with high quality, ensuring standard nutrition parameters.</p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <ShieldCheck size={32} />
                  </div>
                  <h3>Hygienic Preparation</h3>
                  <p>Our cooking staff goes through weekly medical reviews and maintains extreme sanitary precautions.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Student Reviews */}
          <section className="section" id="reviews">
            <div className="container">
              <h2 className="section-title">⭐ Student Reviews</h2>
              <p className="section-subtitle">See what your batchmates have to say about our canteen experience.</p>

              <div className="reviews-grid">
                <div className="review-card">
                  <div className="review-user">
                    <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80" alt="Student" className="avatar-img" />
                    <div className="review-user-info">
                      <h4>Rahul Sen</h4>
                      <div className="rating-container" style={{ display: 'inline-flex', marginLeft: '0px' }}>
                        <Star size={10} fill="currentColor" />
                        <span>5.0</span>
                      </div>
                    </div>
                  </div>
                  <p className="review-comment">"The Chicken Biryani is absolutely stellar! Being able to pre-book it from the library and pick it up right when class ends is a lifesaver. No more 20-minute queues!"</p>
                </div>

                <div className="review-card">
                  <div className="review-user">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Student" className="avatar-img" />
                    <div className="review-user-info">
                      <h4>Ananya R.</h4>
                      <div className="rating-container" style={{ display: 'inline-flex', marginLeft: '0px' }}>
                        <Star size={10} fill="currentColor" />
                        <span>4.8</span>
                      </div>
                    </div>
                  </div>
                  <p className="review-comment">"Highly recommend the Masala Dosa and filter coffee for breakfast. Tastes very authentic. The interface is extremely smooth and the status tracking is super accurate."</p>
                </div>

                <div className="review-card">
                  <div className="review-user">
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Student" className="avatar-img" />
                    <div className="review-user-info">
                      <h4>Vikram Malhotra</h4>
                      <div className="rating-container" style={{ display: 'inline-flex', marginLeft: '0px' }}>
                        <Star size={10} fill="currentColor" />
                        <span>4.9</span>
                      </div>
                    </div>
                  </div>
                  <p className="review-comment">"Best part is that searched foods don't automatically drop into the cart like other basic projects. The search filter is extremely quick. 10/10 UX design!"</p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Section */}
          <footer className="footer" id="contact">
            <div className="container">
              <div className="footer-grid">
                <div className="footer-col">
                  <h2 style={{ color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>MITS Canteen</span>
                  </h2>
                  <p style={{ color: '#bcaaa4', fontSize: '0.9rem' }}>
                    Providing premium Indian dining and fast-booking capabilities to the students and faculty of MITS Madanapalle.
                  </p>
                </div>

                <div className="footer-col">
                  <h3>Quick Links</h3>
                  <ul className="footer-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#menu">Full Menu</a></li>
                    <li><a href="#popular">Popular Foods</a></li>
                    <li><a href="#reviews">Student Reviews</a></li>
                  </ul>
                </div>

                <div className="footer-col">
                  <h3>Opening Hours</h3>
                  <div className="footer-contact" style={{ fontSize: '0.9rem' }}>
                    <div className="footer-contact-item">
                      <Clock size={16} color="var(--primary)" />
                      <span>Breakfast: 7:30 AM – 11:00 AM</span>
                    </div>
                    <div className="footer-contact-item">
                      <Clock size={16} color="var(--primary)" />
                      <span>Lunch: 12:00 PM – 3:00 PM</span>
                    </div>
                    <div className="footer-contact-item">
                      <Clock size={16} color="var(--primary)" />
                      <span>Snacks: 3:30 PM – 8:00 PM</span>
                    </div>
                  </div>
                </div>

                <div className="footer-col">
                  <h3>Contact Canteen</h3>
                  <div className="footer-contact" style={{ fontSize: '0.9rem' }}>
                    <div className="footer-contact-item">
                      <MapPin size={16} color="var(--primary)" />
                      <span>Canteen Main Hall, MITS campus, Madanapalle - 517325.</span>
                    </div>
                    <div className="footer-contact-item">
                      <Phone size={16} color="var(--primary)" />
                      <span>+91 431 250 3000</span>
                    </div>
                    <div className="footer-contact-item">
                      <Mail size={16} color="var(--primary)" />
                      <span>canteen.support@mits.edu</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} MITS Canteen Management System. Designed for MITS Madanapalle Final Project Demonstration. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </>
      ) : (
        <Dashboard
          role={user?.role}
          user={user}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          menuItems={menuItems}
          onAddMenuItem={handleAddMenuItem}
          onEditMenuItem={handleEditMenuItem}
          onDeleteMenuItem={handleDeleteMenuItem}
          onToggleAvailability={handleToggleAvailability}
        />
      )}

      {/* Cart Drawer */}
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        user={user}
      />

      {/* Authentication Modal */}
      <Auth
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
      />

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
