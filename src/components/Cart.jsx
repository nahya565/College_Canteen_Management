import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  user
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + gst;

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={24} color="var(--primary)" />
            <span>Your Cart ({cartItems.length})</span>
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-items-container">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div className="cart-item animate-card" key={item.id}>
                <img src={item.image_url} alt={item.name} className="cart-item-img" />
                
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price}</div>
                  
                  <div className="qty-controls" style={{ marginTop: '8px', display: 'inline-flex' }}>
                    <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.qty - 1)}>-</button>
                    <span className="qty-number">{item.qty}</span>
                    <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                </div>

                <button className="action-btn delete" onClick={() => onRemoveItem(item.id)} title="Remove Item">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', margin: 'auto 0', color: '#7D6B67' }}>
              <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <p style={{ fontWeight: 600 }}>Your cart is empty</p>
              <p style={{ fontSize: '0.85rem' }}>Add items from the menu to pre-book them.</p>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>GST (5%)</span>
              <span>₹{gst}</span>
            </div>
            <div className="summary-row total">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>
            
            <button className="btn btn-primary checkout-btn" onClick={onCheckout}>
              <span>{user ? 'Confirm Pre-Booking' : 'Login to Pre-Book'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
