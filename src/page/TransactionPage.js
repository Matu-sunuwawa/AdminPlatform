
import React, { useState, useEffect, useContext } from "react";
import '../style/css/TransactionPage.css';
import { useLocation } from "react-router-dom";
import SideBar from "../component/SideBar";
import AuthContext from '../context/AuthContext';


const TransactionPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [selectedRows, setSelectedRows] = useState([]);

  const location = useLocation();

  const { transactionRecord } = useContext(AuthContext)

  useEffect(() => {
    setLoading(true);
    const fetchCustomers = async () => {
        try {
            const data = await transactionRecord();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };
    fetchCustomers();
  }, [transactionRecord]);

  useEffect(() => {
    let filtered = [...transactions];
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
  }, [transactions, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
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
      <SideBar activePath={location.pathname} />

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
          <div className="header-icons">
            <button
              className="icon notification-btn"
              aria-label={`Notifications (${notifications.length} new)`}
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="notification-badge">{notifications.length}</span>
            </button>
            <button
              className="icon"
              aria-label="Messages"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
            <button
              className="icon"
              aria-label="Profile"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button
              className="icon"
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
                        aria-label={`Select transaction ${transaction.id}`}
                        className="checkbox"
                      />
                    </td>
                    <td className="table-cell">{transaction.id}</td>
                    <td className="table-cell">{transaction.amount.toFixed(2)} ETB</td>
                    <td className="table-cell">{transaction.from_user}</td>
                    <td className="table-cell">{transaction.to_user}</td>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;