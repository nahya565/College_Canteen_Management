import React, { useState } from 'react';
import {
  TrendingUp,
  ClipboardList,
  Clock,
  CheckCircle,
  Plus,
  Edit2,
  Trash2,
  Download,
  UtensilsCrossed,
  Users,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

export default function Dashboard({
  role, // student, admin
  user,
  orders,
  onUpdateOrderStatus,
  menuItems,
  onAddMenuItem,
  onEditMenuItem,
  onDeleteMenuItem,
  onToggleAvailability
}) {
  const [activeTab, setActiveTab] = useState(role === 'admin' ? 'orders' : 'my-orders');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Form states for menu item adding/editing
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('Breakfast');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemImg, setItemImg] = useState('');
  const [itemVeg, setItemVeg] = useState(true);
  const [itemPopular, setItemPopular] = useState(false);

  // Helper to open edit modal
  const openEditModal = (item) => {
    setCurrentItem(item);
    setItemName(item.name);
    setItemCategory(item.category);
    setItemPrice(item.price);
    setItemDesc(item.description);
    setItemImg(item.image_url);
    setItemVeg(item.is_veg);
    setItemPopular(item.is_popular);
    setShowEditModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    onAddMenuItem({
      name: itemName,
      category: itemCategory,
      price: parseFloat(itemPrice),
      description: itemDesc,
      image_url: itemImg || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80",
      is_veg: itemVeg,
      is_popular: itemPopular,
      is_available: true,
      rating: 4.5
    });
    setShowAddModal(false);
    resetForm();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEditMenuItem({
      ...currentItem,
      name: itemName,
      category: itemCategory,
      price: parseFloat(itemPrice),
      description: itemDesc,
      image_url: itemImg,
      is_veg: itemVeg,
      is_popular: itemPopular
    });
    setShowEditModal(false);
    resetForm();
  };

  const resetForm = () => {
    setItemName('');
    setItemCategory('Breakfast');
    setItemPrice('');
    setItemDesc('');
    setItemImg('');
    setItemVeg(true);
    setItemPopular(false);
    setCurrentItem(null);
  };

  // CSV Report Generator
  const downloadSalesReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Order ID,Student Name,Items,Subtotal,GST,Grand Total,Status,Date\n";
    
    orders.forEach((o) => {
      const itemSummary = o.items.map(i => `${i.name} (${i.qty})`).join('; ');
      csvContent += `${o.id},${o.username},"${itemSummary}",${o.subtotal},${o.gst},${o.grand_total},${o.status},${o.date}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Canteen_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Aggregates for Admin Dashboard
  const totalSales = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.grand_total : sum, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length;
  const readyOrders = orders.filter(o => o.status === 'ready').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        {role === 'admin' ? (
          <>
            <div style={{ padding: '0 16px 20px', borderBottom: '1px solid var(--bg-cream)', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>Canteen Staff</h3>
              <p style={{ fontSize: '0.75rem', color: '#7D6B67' }}>MITS Madanapalle</p>
            </div>
            <div className={`sidebar-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              <ClipboardList size={18} />
              <span>Pre-Bookings</span>
            </div>
            <div className={`sidebar-link ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>
              <UtensilsCrossed size={18} />
              <span>Manage Menu</span>
            </div>
            <div className={`sidebar-link ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
              <TrendingUp size={18} />
              <span>Sales Reports</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ padding: '0 16px 20px', borderBottom: '1px solid var(--bg-cream)', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{user?.username}</h3>
              <p style={{ fontSize: '0.75rem', color: '#7D6B67' }}>Student Account</p>
            </div>
            <div className={`sidebar-link ${activeTab === 'my-orders' ? 'active' : ''}`} onClick={() => setActiveTab('my-orders')}>
              <ClipboardList size={18} />
              <span>My Pre-Bookings</span>
            </div>
            <div className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <Users size={18} />
              <span>My Profile</span>
            </div>
          </>
        )}
      </aside>

      {/* DASHBOARD CONTENT BODY */}
      <main className="dashboard-main">
        {role === 'admin' && activeTab === 'orders' && (
          <div>
            {/* STATS OVERVIEW CARDS */}
            <div className="stats-grid">
              <div className="stat-card">
                <div>
                  <div className="stat-label">Total Sales</div>
                  <div className="stat-num">₹{totalSales}</div>
                </div>
                <div className="stat-icon-wrapper green">
                  <TrendingUp size={24} />
                </div>
              </div>
              <div className="stat-card">
                <div>
                  <div className="stat-label">Pending Orders</div>
                  <div className="stat-num">{pendingOrders}</div>
                </div>
                <div className="stat-icon-wrapper">
                  <Clock size={24} />
                </div>
              </div>
              <div className="stat-card">
                <div>
                  <div className="stat-label">Preparing</div>
                  <div className="stat-num">{preparingOrders}</div>
                </div>
                <div className="stat-icon-wrapper blue">
                  <UtensilsCrossed size={24} />
                </div>
              </div>
              <div className="stat-card">
                <div>
                  <div className="stat-label">Ready for Pickup</div>
                  <div className="stat-num">{readyOrders}</div>
                </div>
                <div className="stat-icon-wrapper green">
                  <CheckCircle size={24} />
                </div>
              </div>
            </div>

            {/* ORDERS MANAGEMENT TABLE */}
            <div className="dashboard-card">
              <div className="card-header-actions">
                <h2>Manage Pre-Bookings</h2>
                <button className="btn btn-outline" onClick={downloadSalesReport} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Download size={16} />
                  <span>Download Report</span>
                </button>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Student</th>
                      <th>Items Pre-booked</th>
                      <th>Grand Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((o) => (
                        <tr key={o.id}>
                          <td style={{ fontWeight: 600 }}>#{o.id}</td>
                          <td>
                            <div>
                              <div style={{ fontWeight: 600 }}>{o.username}</div>
                              <div style={{ fontSize: '0.75rem', color: '#7D6B67' }}>{o.email}</div>
                            </div>
                          </td>
                          <td>
                            <ul style={{ listStyle: 'none', fontSize: '0.9rem' }}>
                              {o.items.map((it, idx) => (
                                <li key={idx}>• {it.name} <span style={{ color: 'var(--primary)', fontWeight: 600 }}>x{it.qty}</span></li>
                              ))}
                            </ul>
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{o.grand_total}</td>
                          <td>
                            <span className={`badge-status ${o.status}`}>{o.status.toUpperCase()}</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {o.status === 'pending' && (
                                <button className="btn btn-primary" onClick={() => onUpdateOrderStatus(o.id, 'preparing')} style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '4px' }}>
                                  Accept & Prepare
                                </button>
                              )}
                              {o.status === 'preparing' && (
                                <button className="btn btn-secondary" onClick={() => onUpdateOrderStatus(o.id, 'ready')} style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '4px' }}>
                                  Mark Ready
                                </button>
                              )}
                              {o.status === 'ready' && (
                                <button className="btn btn-primary" onClick={() => onUpdateOrderStatus(o.id, 'completed')} style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '4px', backgroundColor: 'var(--accent-green)' }}>
                                  Pick Up Complete
                                </button>
                              )}
                              {o.status !== 'completed' && o.status !== 'cancelled' && (
                                <button className="action-btn delete" onClick={() => onUpdateOrderStatus(o.id, 'cancelled')} title="Cancel Order">
                                  <X size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', color: '#7D6B67', padding: '24px' }}>
                          No orders booked today.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {role === 'admin' && activeTab === 'menu' && (
          <div className="dashboard-card">
            <div className="card-header-actions">
              <h2>Canteen Menu Manager</h2>
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ padding: '10px 20px', borderRadius: '8px' }}>
                <Plus size={18} />
                <span>Add Food Item</span>
              </button>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Veg/Non-Veg</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={item.image_url} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#7D6B67' }}>{item.description.substring(0, 40)}...</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{item.category}</td>
                      <td style={{ fontWeight: 700 }}>₹{item.price}</td>
                      <td>
                        <span className={`badge-status ${item.is_veg ? 'completed' : 'cancelled'}`} style={{ fontSize: '0.7rem' }}>
                          {item.is_veg ? 'VEG' : 'NON-VEG'}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn ${item.is_available ? 'btn-primary' : 'btn-outline'}`}
                          style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '20px' }}
                          onClick={() => onToggleAvailability(item.id)}
                        >
                          {item.is_available ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="action-btn edit" onClick={() => openEditModal(item)} title="Edit Item">
                            <Edit2 size={16} />
                          </button>
                          <button className="action-btn delete" onClick={() => onDeleteMenuItem(item.id)} title="Delete Item">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {role === 'admin' && activeTab === 'reports' && (
          <div className="dashboard-card">
            <h2>Financial Sales Analysis</h2>
            <p style={{ color: '#7D6B67', marginBottom: '24px' }}>Analyze order details and export Excel-compatible data sheets for auditing.</p>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
              <div style={{ background: '#FFF3E0', padding: '24px', borderRadius: '12px', flex: 1, minWidth: '200px' }}>
                <h3>Today's Net Revenue</h3>
                <h1 style={{ fontSize: '2.5rem', margin: '8px 0', color: 'var(--primary)' }}>₹{totalSales}</h1>
                <p style={{ fontSize: '0.85rem', color: '#7D6B67' }}>Based on 5% standard state CGST/SGST pre-booking.</p>
              </div>
              <div style={{ background: '#E8F5E9', padding: '24px', borderRadius: '12px', flex: 1, minWidth: '200px' }}>
                <h3>Completed Orders</h3>
                <h1 style={{ fontSize: '2.5rem', margin: '8px 0', color: 'var(--accent-green)' }}>{completedOrders}</h1>
                <p style={{ fontSize: '0.85rem', color: '#7D6B67' }}>Food successfully prepared and picked up.</p>
              </div>
            </div>

            <button className="btn btn-secondary" onClick={downloadSalesReport}>
              <Download size={18} />
              <span>Export Sales Sheet (CSV)</span>
            </button>
          </div>
        )}

        {/* STUDENT VIEWS */}
        {role === 'student' && activeTab === 'my-orders' && (
          <div>
            <h2>My Food Pre-Bookings</h2>
            <p style={{ color: '#7D6B67', marginBottom: '30px' }}>Track your active food tickets or review past canteen logs.</p>

            {orders.filter(o => o.email === user?.email).length > 0 ? (
              orders.filter(o => o.email === user?.email).map((o) => {
                // Determine timeline progress width and step activation states
                let progressWidth = '0%';
                let pendingState = 'completed';
                let prepState = 'pending';
                let readyState = 'pending';
                let compState = 'pending';

                if (o.status === 'preparing') {
                  progressWidth = '33%';
                  prepState = 'active';
                } else if (o.status === 'ready') {
                  progressWidth = '66%';
                  prepState = 'completed';
                  readyState = 'active';
                } else if (o.status === 'completed') {
                  progressWidth = '100%';
                  prepState = 'completed';
                  readyState = 'completed';
                  compState = 'completed';
                } else if (o.status === 'cancelled') {
                  progressWidth = '0%';
                  pendingState = 'cancelled';
                }

                return (
                  <div className="dashboard-card animate-card" key={o.id} style={{ borderLeft: '5px solid var(--primary)' }}>
                    <div className="card-header-actions" style={{ marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem' }}>Order #{o.id}</h3>
                        <span style={{ fontSize: '0.8rem', color: '#7D6B67' }}>Placed on: {o.date}</span>
                      </div>
                      <div>
                        <span className={`badge-status ${o.status}`} style={{ fontSize: '0.85rem' }}>{o.status.toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Timeline (only show for active non-cancelled/non-completed orders) */}
                    {o.status !== 'cancelled' && (
                      <div className="timeline">
                        <div className="timeline-progress" style={{ width: progressWidth }}></div>
                        
                        <div className={`timeline-step ${pendingState}`}>
                          <div className="timeline-icon-wrapper">
                            <Clock size={18} />
                          </div>
                          <div className="timeline-label">Pre-Booked</div>
                        </div>

                        <div className={`timeline-step ${prepState}`}>
                          <div className="timeline-icon-wrapper">
                            <UtensilsCrossed size={18} />
                          </div>
                          <div className="timeline-label">Kitchen Preparing</div>
                        </div>

                        <div className={`timeline-step ${readyState}`}>
                          <div className="timeline-icon-wrapper">
                            <CheckCircle size={18} />
                          </div>
                          <div className="timeline-label">Ready for Pickup</div>
                        </div>

                        <div className={`timeline-step ${compState}`}>
                          <div className="timeline-icon-wrapper">
                            <Check size={18} />
                          </div>
                          <div className="timeline-label">Completed</div>
                        </div>
                      </div>
                    )}

                    {o.status === 'cancelled' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C62828', margin: '20px 0', padding: '12px', background: '#FFEBEE', borderRadius: '8px' }}>
                        <AlertCircle size={20} />
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>This booking has been cancelled. If amount was paid online, it will be refunded.</span>
                      </div>
                    )}

                    {o.status === 'ready' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-green)', margin: '20px 0', padding: '12px', background: '#E8F5E9', borderRadius: '8px' }}>
                        <CheckCircle size={20} />
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Your food is ready at the counter! Please display Order #{o.id} ticket to collect.</span>
                      </div>
                    )}

                    {/* Summary items */}
                    <div style={{ borderTop: '1px solid var(--bg-cream)', paddingTop: '16px', marginTop: '16px' }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Items Summary</h4>
                      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                        {o.items.map((it, idx) => (
                          <li key={idx} style={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span>{it.name} <strong style={{ color: 'var(--primary)' }}>x{it.qty}</strong></span>
                            <span>₹{it.price * it.qty}</span>
                          </li>
                        ))}
                      </ul>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px dashed var(--glass-border)', paddingTop: '10px', marginTop: '10px' }}>
                        <span>Total (including 5% GST)</span>
                        <span style={{ color: 'var(--primary)' }}>₹{o.grand_total}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#7D6B67' }}>
                <ClipboardList size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                <p style={{ fontWeight: 600 }}>No pre-bookings yet</p>
                <p style={{ fontSize: '0.85rem' }}>Your pre-booked orders will appear here. Head over to our Menu to place your first booking.</p>
              </div>
            )}
          </div>
        )}

        {role === 'student' && activeTab === 'profile' && (
          <div className="dashboard-card" style={{ maxWidth: '600px' }}>
            <h2>Student Profile</h2>
            <p style={{ color: '#7D6B67', marginBottom: '24px' }}>Official credentials verified via MITS Student Portal.</p>
            
            <div style={{ borderBottom: '1px solid var(--bg-cream)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ color: '#7D6B67', fontSize: '0.8rem', fontWeight: 600 }}>FULL NAME</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{user?.username}</div>
            </div>

            <div style={{ borderBottom: '1px solid var(--bg-cream)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ color: '#7D6B67', fontSize: '0.8rem', fontWeight: 600 }}>COLLEGE EMAIL</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{user?.email}</div>
            </div>

            <div style={{ borderBottom: '1px solid var(--bg-cream)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ color: '#7D6B67', fontSize: '0.8rem', fontWeight: 600 }}>PHONE NUMBER</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>+91 {user?.phone || 'N/A'}</div>
            </div>

            <div>
              <div style={{ color: '#7D6B67', fontSize: '0.8rem', fontWeight: 600 }}>AFFILIATE CAMPUS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Madanapalle Institute of Technology and Science (MITS)</div>
            </div>
          </div>
        )}
      </main>

      {/* ADD ITEM MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Add New Menu Item</h3>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Item Name</label>
                <input type="text" required className="form-control" value={itemName} onChange={(e) => setItemName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-control" value={itemCategory} onChange={(e) => setItemCategory(e.target.value)}>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Beverages">Drinks & Beverages</option>
                  <option value="Milkshakes">Milkshakes</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input type="number" required min={0} className="form-control" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea required className="form-control" rows={3} value={itemDesc} onChange={(e) => setItemDesc(e.target.value)}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input type="url" placeholder="Optional" className="form-control" value={itemImg} onChange={(e) => setItemImg(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={itemVeg} onChange={(e) => setItemVeg(e.target.checked)} />
                  <span>Vegetarian Item</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={itemPopular} onChange={(e) => setItemPopular(e.target.checked)} />
                  <span>Mark Popular (Homepage)</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ITEM MODAL */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Edit Menu Item</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Item Name</label>
                <input type="text" required className="form-control" value={itemName} onChange={(e) => setItemName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-control" value={itemCategory} onChange={(e) => setItemCategory(e.target.value)}>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Beverages">Drinks & Beverages</option>
                  <option value="Milkshakes">Milkshakes</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input type="number" required min={0} className="form-control" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea required className="form-control" rows={3} value={itemDesc} onChange={(e) => setItemDesc(e.target.value)}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input type="url" required className="form-control" value={itemImg} onChange={(e) => setItemImg(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={itemVeg} onChange={(e) => setItemVeg(e.target.checked)} />
                  <span>Vegetarian Item</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={itemPopular} onChange={(e) => setItemPopular(e.target.checked)} />
                  <span>Mark Popular (Homepage)</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
