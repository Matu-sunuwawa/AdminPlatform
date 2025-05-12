

import React, { useState, useEffect } from "react";
import "./TransactionsPage.css";
import { useNavigate } from "react-router-dom";

const TransactionsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [transactions, setTransactions] = useState([]); // API: Store fetched transaction data here
  const [notifications, setNotifications] = useState([]); // API: Store fetched notifications
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]); // State for selected rows
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);

  const navigate = useNavigate();

  // Effect to fetch transactions and notifications from API
  useEffect(() => {
    setLoading(true);
    const fetchTransactions = async () => {
      try {
        const response = await fetch("https://potion.dev.gumisofts.com/platform_admin/transaction-records/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json(); // API: Data structure matches payload [ { id, from_user(phone No), to_user(phone No), amount, status, remarks, date } ]
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        // API: Handle fallback data or error UI here if needed
        setTransactions([
          {
            id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "from_user(phone No)": "+251911111111",
            "to_user(phone No)": "+251922222222",
            amount: 100.50,
            status: "pending",
            remarks: "Test transaction",
            date: "2025-05-07T23:06:00.217Z",
          },
          {
            id: "6l9m0n24-1o2d-3e4f-h0i1-5p396q77i901",
            "from_user(phone No)": "+251955656565",
            "to_user(phone No)": "+251966767676",
            amount: 500.00,
            status: "succeeded",
            remarks: "Freelance project payment",
            date: "2025-04-30T22:30:00.000Z",
          },
          {
            id: "8n1o2p46-3q4e-5f6g-i1j2-7r518s99j123",
            "from_user(phone No)": "+251977878787",
            "to_user(phone No)": "+251988989898",
            amount: 45.00,
            status: "pending",
            remarks: "Gift card purchase",
            date: "2025-04-29T11:00:00.000Z",
          },
          {
            id: "0p3q4r68-5s6f-7g8h-j1k2-9t730u11k345",
            "from_user(phone No)": "+251999090909",
            "to_user(phone No)": "+251910212121",
            amount: 180.25,
            status: "succeeded",
            remarks: "Medical expense",
            date: "2025-04-28T07:40:00.000Z",
          },
          {
            id: "1a2b3c4d-7e8f-9g0h-i1j2-k3l4m5n6o7p8",
            "from_user(phone No)": "+251923232323",
            "to_user(phone No)": "+251934343434",
            amount: 250.00,
            status: "pending",
            remarks: "Event ticket booking",
            date: "2025-05-01T14:15:00.000Z",
          },
          {
            id: "9z8y7x6w-5v4u-3t2s-r1q0-p9o8n7m6l5k4",
            "from_user(phone No)": "+251911223344",
            "to_user(phone No)": "+251922334455",
            amount: 720.00,
            status: "succeeded",
            remarks: "E-commerce purchase",
            date: "2025-04-27T18:45:00.000Z",
          },
          {
            id: "4e5f6g7h-8i9j-0k1l-m2n3-o4p5q6r7s8t9",
            "from_user(phone No)": "+251900112233",
            "to_user(phone No)": "+251911223344",
            amount: 90.75,
            status: "failed",
            remarks: "Insufficient funds",
            date: "2025-04-25T10:20:00.000Z",
          },
          {
            id: "7u6t5r4e-3w2q-1z0x-v9y8-u7t6s5r4e3w2",
            "from_user(phone No)": "+251933445566",
            "to_user(phone No)": "+251944556677",
            amount: 330.10,
            status: "succeeded",
            remarks: "Mobile device payment",
            date: "2025-05-02T09:00:00.000Z",
          }
        ]);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await fetch("https://potion.dev.gumisofts.com/platform_admin/notifications/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json(); // API: Data structure [ { id, message, timestamp } ]
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        // API: Handle fallback data or error UI here if needed
        setNotifications([
          { id: 1, message: "New transaction recorded: 3fa85f64", timestamp: "2025-05-07 14:30" },
          { id: 2, message: "Transaction 6l9m0n24 completed", timestamp: "2025-05-06 12:15" },
          { id: 3, message: "Customer 90dd3200 registered", timestamp: "2025-05-06 09:00" },
        ]);
      }
    };

    Promise.all([fetchTransactions(), fetchNotifications()]).finally(() => setLoading(false));
  }, []);

  // Effect to filter and sort transactions
  useEffect(() => {
    let filtered = [...transactions];
    if (searchTerm) {
      filtered = filtered.filter((transaction) =>
        Object.values(transaction).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    filtered.sort((a, b) => {
      if (sortConfig.key === "amount") {
        return sortConfig.direction === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      if (sortConfig.key === "date") {
        return sortConfig.direction === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      const valueA = a[sortConfig.key]?.toString().toLowerCase() || '';
      const valueB = b[sortConfig.key]?.toString().toLowerCase() || '';
      return sortConfig.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
    setFilteredTransactions(filtered);
  }, [transactions, sortConfig, searchTerm]);

  // Handler for sorting table columns
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handler for search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handler for "select all" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredTransactions.map((_, index) => index));
    } else {
      setSelectedRows([]);
    }
  };

  // Handler for individual row checkboxes
  const handleRowSelect = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(i => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  // Handler for "Actions" button click
  const handleActionsClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsPopupOpen(true);
  };

  // Handler for popup actions
  const handlePopupAction = (action) => {
    console.log(`Action "${action}" performed for transaction ${selectedTransaction.id}`);
    setIsPopupOpen(false);
  };

  // Handler for header icon buttons
  const handleButtonClick = (buttonName) => {
    if (buttonName === "Notification") {
      setIsNotificationPopupOpen(true);
    }
    console.log(`Button "${buttonName}" clicked`);
  };

  if (loading) {
    return (
      <div className="transactions-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <span>Loading transactions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`transactions-page ${!isSidebarOpen ? 'sidebar-hidden' : ''}`}>
      <div className={`sidebar ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="sidebar-header">
          <h1>Mela</h1>
         
        </div>
        <ul className="sidebar-menu">
          <li className="menu-item" onClick={() => navigate('/')} aria-label="Home">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </li>
          <li className="menu-item" onClick={() => navigate('/customers')} aria-label="Customers">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </li>
          <li className="menu-item" onClick={() => navigate('/disputes')} aria-label="Disputes">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </li>
          <li className="menu-item active" onClick={() => navigate('/transactions')} aria-label="Transactions">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
            </svg>
          </li>
          <li
            className="menu-item"
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
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="menu-toggle-btn"
            aria-label="Open Sidebar"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div className="header">
          <input
            type="text"
            placeholder="Search by any field"
            className="search-bar"
            value={searchTerm}
            onChange={handleSearch}
            aria-label="Search transactions"
          />
          <div className="header-icons">
            <button
              className="icon notification-btn"
              onClick={() => handleButtonClick("Notification")}
              aria-label={`Notifications (${notifications.length} new)`}
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="notification-badge">{notifications.length}</span>
            </button>
            <button
              className="icon"
              onClick={() => handleButtonClick("Messages")}
              aria-label="Messages"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
            <button
              className="icon"
              onClick={() => handleButtonClick("Profile")}
              aria-label="Profile"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button
              className="icon"
              onClick={() => handleButtonClick("Add New")}
              aria-label="Add New Transaction"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <h1 className="page-title">Transactions</h1>

        <div className="table-container">
          <table className="transactions-table">
            <thead>
              <tr className="table-header">
                <th className="table-header-cell">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedRows.length === filteredTransactions.length && filteredTransactions.length > 0}
                    aria-label="Select All Transactions"
                    className="checkbox"
                  />
                </th>
                <th
                  className="table-header-cell sortable"
                  onClick={() => handleSort("id")}
                  aria-label="Sort by Transaction ID"
                >
                  Transaction ID
                  {sortConfig.key === "id" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th
                  className="table-header-cell sortable"
                  onClick={() => handleSort("amount")}
                  aria-label="Sort by Amount"
                >
                  Amount
                  {sortConfig.key === "amount" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th
                  className="table-header-cell sortable"
                  onClick={() => handleSort("from_user(phone No)")}
                  aria-label="Sort by From Phone"
                >
                  From (Phone)
                  {sortConfig.key === "from_user(phone No)" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th
                  className="table-header-cell sortable"
                  onClick={() => handleSort("to_user(phone No)")}
                  aria-label="Sort by To Phone"
                >
                  To (Phone)
                  {sortConfig.key === "to_user(phone No)" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th className="table-header-cell">Remarks</th>
                <th
                  className="table-header-cell sortable"
                  onClick={() => handleSort("date")}
                  aria-label="Sort by Date"
                >
                  Date
                  {sortConfig.key === "date" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="table-cell no-data">No transactions found</td>
                </tr>
              ) : (
                filteredTransactions.map((transaction, index) => (
                  <tr key={transaction.id} className="table-row">
                    <td className="table-cell">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(index)}
                        onChange={() => handleRowSelect(index)}
                        aria-label={`Select transaction ${transaction.id}`}
                        className="checkbox"
                      />
                    </td>
                    <td className="table-cell">{transaction.id}</td>
                    <td className="table-cell">${transaction.amount.toFixed(2)} USD</td>
                    <td className="table-cell">{transaction["from_user(phone No)"]}</td>
                    <td className="table-cell">{transaction["to_user(phone No)"]}</td>
                    <td className="table-cell">{transaction.remarks || "-"}</td>
                    <td className="table-cell">
                      {new Date(transaction.date).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleActionsClick(transaction)}
                        className="action-btn"
                        aria-label={`Actions for transaction ${transaction.id}`}
                      >
                        Actions
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {isPopupOpen && selectedTransaction && (
          <div className="popup-overlay">
            <div className="popup-content">
              <div className="popup-header">
                <h2 className="popup-title">Transaction Actions</h2>
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="popup-close-btn"
                  aria-label="Close Popup"
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="popup-body">
                <div className="popup-section">
                  <h3 className="popup-section-title">Transaction Details</h3>
                  <p className="popup-info"><strong>ID:</strong> {selectedTransaction.id}</p>
                  <p className="popup-info"><strong>From:</strong> {selectedTransaction["from_user(phone No)"]}</p>
                  <p className="popup-info"><strong>To:</strong> {selectedTransaction["to_user(phone No)"]}</p>
                  <p className="popup-info"><strong>Amount:</strong> ${selectedTransaction.amount.toFixed(2)} USD</p>
                  <p className="popup-info"><strong>Remarks:</strong> {selectedTransaction.remarks || "N/A"}</p>
                  <p className="popup-info"><strong>Date:</strong>{" "}
                    {new Date(selectedTransaction.date).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <div className="popup-section">
                  <h3 className="popup-section-title">Actions</h3>
                  
                  {/* refund transaction api here */}
                  <button
                    onClick={() => handlePopupAction("Refund")}
                    className="popup-btn refund"
                    aria-label="Refund transaction"u
                  >
                    Refund
                  </button>
                  <button
                    onClick={() => handlePopupAction("Cancel")}
                    className="popup-btn cancel"
                    aria-label="Cancel transaction"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePopupAction("View Details")}
                    className="popup-btn view"
                    aria-label="View transaction details"
                  >
                    View Details
                  </button>
                </div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="popup-body">
                {notifications.length === 0 ? (
                  <p className="popup-info">No notifications available</p>
                ) : (
                  notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(notification => (
                    <div key={notification.id} className="notification-item">
                      <p className="popup-info">{notification.message}</p>
                      <p className="popup-info small">{notification.timestamp}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;