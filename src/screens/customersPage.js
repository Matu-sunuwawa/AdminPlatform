
// Importing React and necessary hooks
import React, { useState, useEffect } from 'react';
import './customersPage.css'; // Import the CSS file for all styling
import { useNavigate } from 'react-router-dom';

// Sample data structure for customers (simulating backend data)
const sampleCustomers = [
    {
        "user_id": "784fb4dc-3043-4253-be18-e27569d00155",
        "phone_number": "912345678",
        "is_phone_verified": true,
        "total_spend": 0,
        "subscription_sum": 0,
        "is_active_subscriber": false,
        "email": "user1@example.com",
        "joined_date": "2024-01-15"
    },
    {
        "user_id": "7a3dbb3f-064f-4f6d-8a89-ced487077966",
        "phone_number": "712345679",
        "is_phone_verified": true,
        "total_spend": 0,
        "subscription_sum": 0,
        "is_active_subscriber": false,
        "email": "user2@example.com",
        "joined_date": "2024-02-20"
    },
    {
        "user_id": "90dd3200-0a88-45c5-83fb-0e643281343e",
        "phone_number": "712345680",
        "is_phone_verified": true,
        "total_spend": -510,
        "subscription_sum": 10500,
        "is_active_subscriber": true,
        "email": "user3@example.com",
        "joined_date": "2024-03-10"
    }
];

// Sample notification data (simulated, ordered by timestamp)
const sampleNotifications = [
    { id: 1, message: "New customer registered: 90dd3200-0a88-45c5-83fb-0e643281343e", timestamp: "2025-05-05 14:30" },
    { id: 2, message: "Payment received from 784fb4dc-3043-4253-be18-e27569d00155", timestamp: "2025-05-05 12:15" },
    { id: 3, message: "Subscription renewed for 7a3dbb3f-064f-4f6d-8a89-ced487077966", timestamp: "2025-05-05 09:00" }
];

// Utility to format phone numbers (adding dashes for readability)
const formatPhoneNumber = (phone) => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phone;
};

// Utility to format currency amounts
const formatAmount = (amount) => {
    return `$${Math.abs(amount).toFixed(2)} USD${amount < 0 ? ' (Refunded)' : ''}`;
};

// Utility to format date
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Removed from the top level and will be moved inside the CustomersPage component

const CustomersPage = () => {
    const navigate = useNavigate(); // Moved here inside the component
    // State for sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    // State for customers data
    const [customers, setCustomers] = useState([]);
    // State for loading indicator
    const [loading, setLoading] = useState(true);
    // State for sorting configuration
    const [sortConfig, setSortConfig] = useState({ key: 'user_id', direction: 'asc' });
    // State for search input
    const [searchTerm, setSearchTerm] = useState('');
    // State for action popup
    const [isActionPopupOpen, setIsActionPopupOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    // State for message input in action popup
    const [message, setMessage] = useState('');
    // State for notification popup
    const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchCustomers = async () => {
            try {
                const response = await fetch('https://potion.dev.gumisofts.com/platform_admin/all_users/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch customers');
                const data = await response.json();
                setCustomers(data);
            } catch (error) {
                console.error('Error fetching customers:', error);
                setCustomers(sampleCustomers);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    useEffect(() => {
        const sortedCustomers = [...customers].sort((a, b) => {
            let valueA, valueB;
            if (sortConfig.key === 'total_spend' || sortConfig.key === 'subscription_sum') {
                valueA = a[sortConfig.key];
                valueB = b[sortConfig.key];
                return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA;
            }
            if (sortConfig.key === 'is_phone_verified' || sortConfig.key === 'is_active_subscriber') {
                valueA = a[sortConfig.key] ? 1 : 0;
                valueB = b[sortConfig.key] ? 1 : 0;
                return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA;
            }
            valueA = a[sortConfig.key].toString().toLowerCase();
            valueB = b[sortConfig.key].toString().toLowerCase();
            return sortConfig.direction === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        });
        setCustomers(sortedCustomers);
    }, [sortConfig]);

    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleButtonClick = (buttonName) => {
        if (buttonName === "Notification") {
            setIsNotificationPopupOpen(true);
        }
        console.log(`Button "${buttonName}" clicked`);
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = sampleCustomers.filter(customer =>
            customer.user_id.toLowerCase().includes(term) ||
            customer.phone_number.includes(term)
        );
        setCustomers(filtered.length > 0 ? filtered : sampleCustomers);
    };

    const handleActionsClick = (customer) => {
        setSelectedCustomer(customer);
        setIsActionPopupOpen(true);
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            console.log(`Message sent to ${selectedCustomer.user_id}: ${message}`);
            setMessage('');
            setIsActionPopupOpen(false);
        }
    };

    const handleBlockCustomer = () => {
        console.log(`Customer ${selectedCustomer.user_id} blocked`);
        setIsActionPopupOpen(false);
    };

    if (loading) {
        return (
            <div className="customers-page">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        
        <div className={`customers-page ${!isSidebarOpen ? 'sidebar-hidden' : ''}`}>
            <div className={`sidebar ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="sidebar-header">
                    <h1>Mela</h1>
                    </div>
        <ul className="sidebar-menu">
          <li className="menu-item" onClick={() => navigate('/')}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </li>
          <li className="menu-item active" onClick={() => navigate('/customers')}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </li>
         
          <li className="menu-item" onClick={() => navigate('/disputes')}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </li> 
          <li className="menu-item" onClick={() => navigate('/transactions')}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01"
              />
            </svg>
          </li>
          <li
            className="menu-item "
            onClick={() => navigate("/verifybiz")}
            aria-label="Business Customers"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7h-4a2 2 0 00-2-2h-4a2 2 0 00-2 2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM10 7h4M12 14h.01"
              />
            </svg>
          </li>
        </ul>
      </div>

            <div className="main-content">
                <div className="header">
                    {!isSidebarOpen && (
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="menu-toggle-btn"
                            aria-label="Open Sidebar"
                        >
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    )}
                    <input
                        type="text"
                        placeholder="Search by User ID or Phone"
                        className="search-bar"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <div className="header-icons">
                        <button
                            className="icon notification-btn"
                            onClick={() => handleButtonClick("Notification")}
                            aria-label="Notifications"
                        >
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                            <span className="notification-badge">3</span>
                        </button>
                        <button
                            className="icon"
                            onClick={() => handleButtonClick("Messages")}
                            aria-label="Messages"
                        >
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                            </svg>
                        </button>
                        <button
                            className="icon"
                            onClick={() => handleButtonClick("Profile")}
                            aria-label="Profile"
                        >
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </button>
                        <button
                            className="icon"
                            onClick={() => handleButtonClick("Add New")}
                            aria-label="Add New Customer"
                        >
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <h1 className="page-title">All Customers</h1>

                <div className="table-container">
                    <table className="customers-table">
                        <thead>
                            <tr className="table-header">
                                <th className="table-header-cell sortable" onClick={() => handleSort('user_id')}>
                                    User ID
                                    {sortConfig.key === 'user_id' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                                </th>
                                <th className="table-header-cell sortable" onClick={() => handleSort('phone_number')}>
                                    Phone Number
                                    {sortConfig.key === 'phone_number' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                                </th>
                                <th className="table-header-cell sortable" onClick={() => handleSort('is_phone_verified')}>
                                    Phone Verified
                                    {sortConfig.key === 'is_phone_verified' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                                </th>
                                <th className="table-header-cell sortable" onClick={() => handleSort('total_spend')}>
                                    Total Spend
                                    {sortConfig.key === 'total_spend' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                                </th>
                                <th className="table-header-cell sortable" onClick={() => handleSort('subscription_sum')}>
                                    Subscription Sum
                                    {sortConfig.key === 'subscription_sum' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                                </th>
                                <th className="table-header-cell sortable" onClick={() => handleSort('is_active_subscriber')}>
                                    Active Subscriber
                                    {sortConfig.key === 'is_active_subscriber' && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                                </th>
                                <th className="table-header-cell">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.user_id} className="table-row">
                                    <td className="table-cell">{customer.user_id}</td>
                                    <td className="table-cell">{formatPhoneNumber(customer.phone_number)}</td>
                                    <td className="table-cell">{customer.is_phone_verified ? 'Yes' : 'No'}</td>
                                    <td className="table-cell">{formatAmount(customer.total_spend)}</td>
                                    <td className="table-cell">{formatAmount(customer.subscription_sum)}</td>
                                    <td className="table-cell">{customer.is_active_subscriber ? 'Yes' : 'No'}</td>
                                    <td className="table-cell">
                                        <button
                                            onClick={() => handleActionsClick(customer)}
                                            className="action-btn"
                                            aria-label={`Actions for ${customer.user_id}`}
                                        >
                                            Actions
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {isActionPopupOpen && selectedCustomer && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <div className="popup-header">
                                <h2 className="popup-title">Customer Actions</h2>
                                <button
                                    onClick={() => setIsActionPopupOpen(false)}
                                    className="popup-close-btn"
                                    aria-label="Close Popup"
                                >
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="popup-body">
                                <div className="popup-section">
                                    <h3 className="popup-section-title">Customer Details</h3>
                                    <p className="popup-info"><strong>User ID:</strong> {selectedCustomer.user_id}</p>
                                    <p className="popup-info"><strong>Phone:</strong> {formatPhoneNumber(selectedCustomer.phone_number)}</p>
                                    <p className="popup-info"><strong>Email:</strong> {selectedCustomer.email || 'N/A'}</p>
                                    <p className="popup-info"><strong>Joined:</strong> {formatDate(selectedCustomer.joined_date)}</p>
                                    <p className="popup-info"><strong>Phone Verified:</strong> {selectedCustomer.is_phone_verified ? 'Yes' : 'No'}</p>
                                    <p className="popup-info"><strong>Total Spend:</strong> {formatAmount(selectedCustomer.total_spend)}</p>
                                    <p className="popup-info"><strong>Subscription Sum:</strong> {formatAmount(selectedCustomer.subscription_sum)}</p>
                                    <p className="popup-info"><strong>Active Subscriber:</strong> {selectedCustomer.is_active_subscriber ? 'Yes' : 'No'}</p>
                                </div>
                                <div className="popup-section">
                                    <h3 className="popup-section-title">Send Message</h3>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type your message here..."
                                        className="message-input"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="popup-btn send-message"
                                        aria-label="Send Message"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                            <div className="popup-footer">
                                <button
                                    onClick={handleBlockCustomer}
                                    className="popup-btn block-customer"
                                    aria-label="Block Customer"
                                >
                                    Block Customer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isNotificationPopupOpen && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <div className="popup-header">
                                <h2 className="popup-title">Notifications</h2>
                                <button
                                    onClick={() => setIsNotificationPopupOpen(false)}
                                    className="popup-close-btn"
                                    aria-label="Close Popup"
                                >
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="popup-body">
                                {sampleNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(notification => (
                                    <div key={notification.id} className="notification-item">
                                        <p className="popup-info">{notification.message}</p>
                                        <p className="popup-info small">{notification.timestamp}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomersPage;