

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