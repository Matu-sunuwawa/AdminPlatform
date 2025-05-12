

import React, { useState, useEffect, useContext } from 'react';
import '../style/css/customersPage.css';
import { useLocation } from 'react-router-dom';
import SideBar from '../component/SideBar';
import AuthContext from '../context/AuthContext';

const formatPhoneNumber = (phone) => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phone;
};

const formatAmount = (amount) => {
    return `${Math.abs(amount).toFixed(2)} ETB${amount < 0 ? '' : ''}`;
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const CustomersPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: 'user_id', direction: 'asc' });
    const [isActionPopupOpen, setIsActionPopupOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [message, setMessage] = useState('');

    const location = useLocation();

    const { allUsers } = useContext(AuthContext)

    useEffect(() => {
        setLoading(true);
        const fetchCustomers = async () => {
            try {
                const data = await allUsers();
                setCustomers(data);
            } catch (error) {
                console.error('Error fetching customers:', error);
                setMessage('Failed to fetch customers.');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, [allUsers]);

    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleActionsClick = (customer) => {
        setSelectedCustomer(customer);
        setIsActionPopupOpen(true);
    };

    if (loading) {
        return (
            <div className="customers-page">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        
        <div className="customers-page">
            <SideBar activePath={location.pathname} />

            <div className="main-content">
                <div className="header">
                    {!isSidebarOpen && (
                        <button
                            className="menu-toggle-btn"
                            aria-label="Open Sidebar"
                        >
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    )}
                    <div className="header-icons">
                        <button
                            className="icon notification-btn"
                            aria-label="Notifications"
                        >
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                            <span className="notification-badge">3</span>
                        </button>
                        <button
                            className="icon"
                            aria-label="Messages"
                        >
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                            </svg>
                        </button>
                        <button
                            className="icon"
                            aria-label="Profile"
                        >
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </button>
                        <button
                            className="icon"
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
                                        className="popup-btn send-message"
                                        aria-label="Send Message"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                            <div className="popup-footer">
                                <button
                                    className="popup-btn block-customer"
                                    aria-label="Block Customer"
                                >
                                    Block Customer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomersPage;