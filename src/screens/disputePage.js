/**
 * disputePage.js
 * This component renders a Disputes page with a retractable sidebar, searchable table,
 * filters, actions popup, and notifications popup. Data is fetched from the API and displayed
 * in a sortable table. Must-know: API integration is marked with comments; search filters across all fields.
 */

import React, { useState, useEffect } from "react";
import "./disputePage.css";
import { useNavigate } from "react-router-dom";

// Utility to format dates for display in the table
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Utility to format the dispute amount with currency
const formatAmount = (amount) => {
  return `$${amount.toFixed(2)} USD`;
};

const DisputesPage = () => {
  // State for sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // State for disputes data fetched from backend
  const [disputes, setDisputes] = useState([]);
  // State for notifications data fetched from backend
  const [notifications, setNotifications] = useState([]);
  // State for filtered disputes based on active tab and search
  const [filteredDisputes, setFilteredDisputes] = useState([]);
  // State for loading indicator during data fetch
  const [loading, setLoading] = useState(true);
  // State for selected filter tab
  const [activeTab, setActiveTab] = useState("Needs response");
  // State for selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  // State for sorting
  const [sortConfig, setSortConfig] = useState({
    key: "created",
    direction: "desc",
  });
  // State for popup visibility and selected dispute
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  // State for phone column toggle (Reporter/Reportee)
  const [showReporterPhone, setShowReporterPhone] = useState(true);
  // State for search input
  const [searchTerm, setSearchTerm] = useState("");
  // State for notification popup
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);

  const navigate = useNavigate();

  // Effect to fetch disputes and notifications from API
  useEffect(() => {
    setLoading(true);
    const fetchDisputes = async () => {
      try {
        const response = await fetch(
          "https://potion.dev.gumisofts.com/platform_admin/dispute-records/",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch disputes");
        const data = await response.json(); // API: Data structure [ { id, reportId, phoneReporter, phoneReportee, email, disputeAmount, created, status, reviewed, resolved } ]
        setDisputes(data);
      } catch (error) {
        console.error("Error fetching disputes:", error);
        // API: Handle fallback data or error UI here if needed
        setDisputes([
          {
            id: 1,
            reportId: "REP001",
            phoneReporter: "555-0101",
            phoneReportee: "555-0102",
            email: "rep1@example.com",
            disputeAmount: 100.5,
            created: "2024-12-03T01:30:00Z",
            status: "Needs response",
            reviewed: false,
            resolved: false,
          },
          {
            id: 2,
            reportId: "REP002",
            phoneReporter: "555-0202",
            phoneReportee: "555-0203",
            email: "rep2@example.com",
            disputeAmount: 200.75,
            created: "2024-11-29T02:39:00Z",
            status: "In review",
            reviewed: true,
            resolved: false,
          },
          {
            id: 3,
            reportId: "REP003",
            phoneReporter: "555-0303",
            phoneReportee: "555-0304",
            email: "rep3@example.com",
            disputeAmount: 50.25,
            created: "2024-11-22T00:49:00Z",
            status: "Needs response",
            reviewed: true,
            resolved: true,
          },
        ]);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "https://potion.dev.gumisofts.com/platform_admin/notifications/",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json(); // API: Data structure [ { id, message, timestamp } ]
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        // API: Handle fallback data or error UI here if needed
        setNotifications([
          {
            id: 1,
            message: "New dispute registered: REP005",
            timestamp: "2025-05-06 14:30",
          },
          {
            id: 2,
            message: "Dispute REP002 marked as reviewed",
            timestamp: "2025-05-06 12:15",
          },
          {
            id: 3,
            message: "Customer 90dd3200-0a88-45c5-83fb-0e643281343e registered",
            timestamp: "2025-05-06 09:00",
          },
        ]);
      }
    };

    Promise.all([fetchDisputes(), fetchNotifications()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // Effect to filter and sort disputes
  useEffect(() => {
    let filtered = [...disputes];
    // Apply tab filter
    if (activeTab === "Needs response") {
      filtered = filtered.filter(
        (dispute) => dispute.status === "Needs response"
      );
    } else if (activeTab === "In review") {
      filtered = filtered.filter((dispute) => dispute.status === "In review");
    } else if (activeTab === "Reviewed") {
      filtered = filtered.filter((dispute) => dispute.reviewed === true);
    } else if (activeTab === "Resolved") {
      filtered = filtered.filter((dispute) => dispute.resolved === true);
    }
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (dispute) =>
          dispute.reportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dispute.phoneReporter
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          dispute.phoneReportee
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (dispute.email &&
            dispute.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          dispute.disputeAmount.toString().includes(searchTerm) ||
          formatDate(dispute.created)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          dispute.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortConfig.key === "disputeAmount") {
        return sortConfig.direction === "asc"
          ? a.disputeAmount - b.disputeAmount
          : b.disputeAmount - a.disputeAmount;
      }
      if (sortConfig.key === "created") {
        return sortConfig.direction === "asc"
          ? new Date(a.created) - new Date(b.created)
          : new Date(b.created) - new Date(a.created);
      }
      const valueA = a[sortConfig.key]?.toString().toLowerCase() || "";
      const valueB = b[sortConfig.key]?.toString().toLowerCase() || "";
      return sortConfig.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
    setFilteredDisputes(filtered);
  }, [disputes, activeTab, searchTerm, sortConfig]);

  // Handler for filter tab clicks
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Handler for sorting table columns
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  // Handler for "select all" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredDisputes.map((_, index) => index));
    } else {
      setSelectedRows([]);
    }
  };

  // Handler for individual row checkboxes
  const handleRowSelect = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  // Handler for "Actions" button click
  const handleActionsClick = (dispute) => {
    setSelectedDispute(dispute);
    setIsPopupOpen(true);
  };

  // Handler for popup actions
  const handlePopupAction = (action) => {
    console.log(
      `Action "${action}" performed for dispute ${selectedDispute.reportId}`
    );
    setIsPopupOpen(false);
  };

  // Handler for phone column toggle
  const handlePhoneToggle = () => {
    setShowReporterPhone(!showReporterPhone);
    setSortConfig({
      key: showReporterPhone ? "phoneReportee" : "phoneReporter",
      direction: sortConfig.direction,
    });
  };

  // Handler for search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
      <div className="disputes-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <span>Loading disputes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`disputes-page ${!isSidebarOpen ? "sidebar-hidden" : ""}`}>
      <div
        className={`sidebar ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sidebar-header">
          <h1>Mela</h1>
         
        </div>
        <ul className="sidebar-menu">
          <li
            className="menu-item"
            onClick={() => navigate("/")}
            aria-label="Home"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </li>
          <li
            className="menu-item"
            onClick={() => navigate("/customers")}
            aria-label="Customers"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </li>
          <li
            className="menu-item active"
            onClick={() => navigate("/disputes")}
            aria-label="Disputes"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </li>
          <li
            className="menu-item"
            onClick={() => navigate("/transactions")}
            aria-label="Transactions"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01"
              />
            </svg>
          </li>
          <li className="menu-item" onClick={() => navigate('/verifybiz')} aria-label="business Customers">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
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
            aria-label="Search disputes"
          />
          <div className="header-icons">
            <button
              className="icon notification-btn"
              onClick={() => handleButtonClick("Notification")}
              aria-label={`Notifications (${notifications.length} new)`}
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="notification-badge">{notifications.length}</span>
            </button>
            <button
              className="icon"
              onClick={() => handleButtonClick("Messages")}
              aria-label="Messages"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </button>
            <button
              className="icon"
              onClick={() => handleButtonClick("Profile")}
              aria-label="Profile"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
            <button
              className="icon"
              onClick={() => handleButtonClick("Add New")}
              aria-label="Add New Dispute"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>

        <h1 className="page-title">Disputes</h1>

        <div className="filter-tabs">
          <button
            className={`tab ${activeTab === "Needs response" ? "active" : ""}`}
            onClick={() => handleTabClick("Needs response")}
            aria-label="Filter by Needs Response"
          >
            Needs response
          </button>
          <button
            className={`tab ${activeTab === "In review" ? "active" : ""}`}
            onClick={() => handleTabClick("In review")}
            aria-label="Filter by In Review"
          >
            In review
          </button>
          <button
            className={`tab ${activeTab === "All disputes" ? "active" : ""}`}
            onClick={() => handleTabClick("All disputes")}
            aria-label="Show All Disputes"
          >
            All disputes
          </button>
          <button
            className={`tab ${activeTab === "Reviewed" ? "active" : ""}`}
            onClick={() => handleTabClick("Reviewed")}
            aria-label="Filter by Reviewed"
          >
            Reviewed
          </button>
          <button
            className={`tab ${activeTab === "Resolved" ? "active" : ""}`}
            onClick={() => handleTabClick("Resolved")}
            aria-label="Filter by Resolved"
          >
            Resolved
          </button>
        </div>

        <div className="table-container">
          <table className="disputes-table">
            <thead>
              <tr className="table-header">
                <th className="table-header-cell">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedRows.length === filteredDisputes.length &&
                      filteredDisputes.length > 0
                    }
                    aria-label="Select All Disputes"
                    className="checkbox"
                  />
                </th>
                <th
                  className="table-header-cell sortable"
                  onClick={() => handleSort("reportId")}
                  aria-label="Sort by Report ID"
                >
                  Report ID
                  {sortConfig.key === "reportId" &&
                    (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th
                  className="table-header-cell sortable"
                  onClick={handlePhoneToggle}
                  aria-label={`Sort by ${
                    showReporterPhone ? "Reporter Phone" : "Reportee Phone"
                  }`}
                >
                  {showReporterPhone ? "Phone (Reporter)" : "Phone (Reportee)"}
                  {(sortConfig.key === "phoneReporter" ||
                    sortConfig.key === "phoneReportee") &&
                    (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th
                  className="table-header-cell sortable"
                  onClick={() => handleSort("email")}
                  aria-label="Sort by Email"
                >
                  Email
                  {sortConfig.key === "email" &&
                    (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th
                  className="table-header-cell sortable"
                  onClick={() => handleSort("disputeAmount")}
                  aria-label="Sort by Dispute Amount"
                >
                  Dispute Amount
                  {sortConfig.key === "disputeAmount" &&
                    (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th
                  className="table-header-cell sortable"
                  onClick={() => handleSort("created")}
                  aria-label="Sort by Created Date"
                >
                  Created
                  {sortConfig.key === "created" &&
                    (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDisputes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="table-cell no-data">
                    No disputes found
                  </td>
                </tr>
              ) : (
                filteredDisputes.map((dispute, index) => (
                  <tr key={dispute.id} className="table-row">
                    <td className="table-cell">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(index)}
                        onChange={() => handleRowSelect(index)}
                        aria-label={`Select dispute ${dispute.reportId}`}
                        className="checkbox"
                      />
                    </td>
                    <td className="table-cell">{dispute.reportId}</td>
                    <td className="table-cell">
                      {showReporterPhone
                        ? dispute.phoneReporter
                        : dispute.phoneReportee}
                    </td>
                    <td className="table-cell">{dispute.email || "-"}</td>
                    <td className="table-cell">
                      {formatAmount(dispute.disputeAmount)}
                    </td>
                    <td className="table-cell">
                      {formatDate(dispute.created)}
                    </td>
                    <td className="table-cell">
                      <span
                        className={`status-indicator ${dispute.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {dispute.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleActionsClick(dispute)}
                        className="action-btn"
                        aria-label={`Actions for dispute ${dispute.reportId}`}
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

        {isPopupOpen && selectedDispute && (
          <div className="popup-overlay">
            <div className="popup-content">
              <div className="popup-header">
                <h2 className="popup-title">Dispute Actions</h2>
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="popup-close-btn"
                  aria-label="Close Popup"
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="popup-body">
                <div className="popup-section">
                  <h3 className="popup-section-title">Dispute Information</h3>
                  <p className="popup-info">
                    <strong>Report ID:</strong> {selectedDispute.reportId}
                  </p>
                  <p className="popup-info">
                    <strong>Reporter Phone:</strong>{" "}
                    {selectedDispute.phoneReporter}
                  </p>
                  <p className="popup-info">
                    <strong>Reportee Phone:</strong>{" "}
                    {selectedDispute.phoneReportee}
                  </p>
                  <p className="popup-info">
                    <strong>Email:</strong> {selectedDispute.email || "N/A"}
                  </p>
                  <p className="popup-info">
                    <strong>Amount:</strong>{" "}
                    {formatAmount(selectedDispute.disputeAmount)}
                  </p>
                  <p className="popup-info">
                    <strong>Created:</strong>{" "}
                    {formatDate(selectedDispute.created)}
                  </p>
                  <p className="popup-info">
                    <strong>Status:</strong> {selectedDispute.status}
                  </p>
                  <p className="popup-info">
                    <strong>Reviewed:</strong>{" "}
                    {selectedDispute.reviewed ? "Yes" : "No"}
                  </p>
                  <p className="popup-info">
                    <strong>Resolved:</strong>{" "}
                    {selectedDispute.resolved ? "Yes" : "No"}
                  </p>
                </div>
                <div className="popup-section">
                  <h3 className="popup-section-title">Actions</h3>
                  <button
                    onClick={() => handlePopupAction("Return Money")}
                    className="popup-btn return-money"
                    aria-label="Return Money"
                  >
                    Return Money
                  </button>
                  <button
                    onClick={() => handlePopupAction("Non-Action Report")}
                    className="popup-btn non-action"
                    aria-label="Non-Action Report"
                  >
                    Non-Action Report
                  </button>
                  <button
                    onClick={() => handlePopupAction("Escalate")}
                    className="popup-btn escalate"
                    aria-label="Escalate Dispute"
                  >
                    Escalate
                  </button>
                  {/* <button
                    onClick={() => handlePopupAction("Archive")}
                    className="popup-btn archive"
                    aria-label="Archive Dispute"
                  >
                    Archive
                  </button> */}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="popup-body">
                {notifications.length === 0 ? (
                  <p className="popup-info">No notifications available</p>
                ) : (
                  notifications
                    .sort(
                      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                    )
                    .map((notification) => (
                      <div key={notification.id} className="notification-item">
                        <p className="popup-info">{notification.message}</p>
                        <p className="popup-info small">
                          {notification.timestamp}
                        </p>
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

export default DisputesPage;
