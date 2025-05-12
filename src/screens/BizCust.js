

import React, { useState, useEffect } from "react";
import "./BizCust.css";
import { useNavigate } from "react-router-dom";

const BizCust = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [businesses, setBusinesses] = useState([]); // API: Store fetched business data here
  const [notifications, setNotifications] = useState([]); // API: Store fetched notifications
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);

  const navigate = useNavigate();

  // Effect to fetch businesses and notifications from API
  useEffect(() => {
    setLoading(true);
    const fetchBusinesses = async () => {
      try {
        // API: Fetch business data from endpoint
        const response = await fetch("https://potion.dev.gumisofts.com/platform_admin/business-records/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch businesses");
        const data = await response.json(); // API: Expected data structure [ { id, businessName, registrationId, contactEmail, contactPhone, totalRevenue, associatedUsers, verificationStatus, verificationDocumentUrl, createdAt } ]
        setBusinesses(data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
        // API: Handle fallback data or error UI here if needed
        setBusinesses([
          {
            id: "bus001",
            businessName: "TechCorp Solutions",
            registrationId: "REG-TECH-001",
            contactEmail: "contact@techcorp.com",
            contactPhone: "+251911223344",
            totalRevenue: 15000.75,
            associatedUsers: ["user001", "user002", "user003"],
            verificationStatus: "pending",
            verificationDocumentUrl: "https://example.com/license-techcorp.pdf",
            createdAt: "2025-05-01T10:00:00.000Z",
          },
          {
            id: "bus002",
            businessName: "Green Enterprises",
            registrationId: "REG-GREEN-002",
            contactEmail: "info@greenent.com",
            contactPhone: "+251922334455",
            totalRevenue: 8200.50,
            associatedUsers: ["user004", "user005"],
            verificationStatus: "approved",
            verificationDocumentUrl: "https://example.com/license-greenent.pdf",
            createdAt: "2025-04-28T14:30:00.000Z",
          },
          {
            id: "bus003",
            businessName: "BlueWave Industries",
            registrationId: "REG-BLUE-003",
            contactEmail: "support@bluewave.com",
            contactPhone: "+251933445566",
            totalRevenue: 23000.25,
            associatedUsers: ["user006"],
            verificationStatus: "rejected",
            verificationDocumentUrl: "https://example.com/license-bluewave.pdf",
            createdAt: "2025-04-25T09:15:00.000Z",
          },
        ]);
      }
    };

    const fetchNotifications = async () => {
      try {
        // API: Fetch notifications from endpoint
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
          { id: 1, message: "New business registered: TechCorp Solutions", timestamp: "2025-05-01 10:00" },
          { id: 2, message: "Business Green Enterprises approved", timestamp: "2025-04-28 14:30" },
          { id: 3, message: "Business BlueWave Industries rejected", timestamp: "2025-04-25 09:15" },
        ]);
      }
    };

    Promise.all([fetchBusinesses(), fetchNotifications()]).finally(() => setLoading(false));
  }, []);

  // Effect to filter and sort businesses
  useEffect(() => {
    let filtered = [...businesses];
    if (searchTerm) {
      filtered = filtered.filter((business) =>
        Object.values(business).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    filtered.sort((a, b) => {
      if (sortConfig.key === "totalRevenue") {
        return sortConfig.direction === "asc"
          ? a.totalRevenue - b.totalRevenue
          : b.totalRevenue - a.totalRevenue;
      }
      if (sortConfig.key === "createdAt") {
        return sortConfig.direction === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      const valueA = a[sortConfig.key]?.toString().toLowerCase() || '';
      const valueB = b[sortConfig.key]?.toString().toLowerCase() || '';
      return sortConfig.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
    setFilteredBusinesses(filtered);
  }, [businesses, sortConfig, searchTerm]);

  // Handler for sorting table columns
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handler for "select all" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredBusinesses.map((_, index) => index));
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

  // Handler for search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handler for "Actions" button click
  const handleActionsClick = (business) => {
    setSelectedBusiness(business);
    setIsPopupOpen(true);
  };

  // Handler for verification actions (Approve, Reject, Request More Info)
  const handleVerificationAction = (action) => {
    if (action === "Approve") {
      // API: Update verification status to "approved"
      console.log(`Approving business ${selectedBusiness.id}`);
      fetch(`https://potion.dev.gumisofts.com/platform_admin/business-records/${selectedBusiness.id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus: "approved" }),
      }).then(() => {
        setBusinesses(businesses.map(business =>
          business.id === selectedBusiness.id ? { ...business, verificationStatus: "approved" } : business
        ));
      }).catch(error => console.error("Error approving business:", error));
    } else if (action === "Reject") {
      // API: Update verification status to "rejected"
      console.log(`Rejecting business ${selectedBusiness.id}`);
      fetch(`https://potion.dev.gumisofts.com/platform_admin/business-records/${selectedBusiness.id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus: "rejected" }),
      }).then(() => {
        setBusinesses(businesses.map(business =>
          business.id === selectedBusiness.id ? { ...business, verificationStatus: "rejected" } : business
        ));
      }).catch(error => console.error("Error rejecting business:", error));
    } else if (action === "Request More Info") {
      // API: Send notification/email to business requesting more info
      console.log(`Requesting more info for business ${selectedBusiness.id}`);
      fetch(`https://potion.dev.gumisofts.com/platform_admin/business-records/${selectedBusiness.id}/request-more-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).catch(error => console.error("Error requesting more info:", error));
    }
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
      <div className="customers-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <span>Loading businesses...</span>
        </div>
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
          <li className="menu-item" onClick={() => navigate('/transactions')} aria-label="Transactions">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
            </svg>
            
          </li>
          <li
            className="menu-item active"
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
            aria-label="Search businesses"
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
              aria-label="Add New Business"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <h1 className="page-title">Business Customers</h1>

        <div className="table-container">
          <table className="customers-table">
            <thead>
              <tr className="table-header">
                <th className="table-header-cell">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedRows.length === filteredBusinesses.length && filteredBusinesses.length > 0}
                    aria-label="Select All Businesses"
                    className="checkbox"
                  />
                </th>
                <th
                  className="table-header-cell sortable"
                  onClick={() => handleSort("businessName")}
                  aria-label="Sort by Business Name"
                >
                  Business Name
                  {sortConfig.key === "businessName" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th
                  className="table-header-cell sortable"
                  onClick={() => handleSort("registrationId")}
                  aria-label="Sort by Registration ID"
                >
                  Registration ID
                  {sortConfig.key === "registrationId" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th
                  className="table-header-cell sortable"
                  onClick={() => handleSort("contactEmail")}
                  aria-label="Sort by Contact Email"
                >
                  Contact Email
                  {sortConfig.key === "contactEmail" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th
                  className="table-header-cell sortable"
                  onClick={() => handleSort("totalRevenue")}
                  aria-label="Sort by Total Revenue"
                >
                  Total Revenue
                  {sortConfig.key === "totalRevenue" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th className="table-header-cell">Associated Users</th>
                <th
                  className="table-header-cell sortable"
                  onClick={() => handleSort("verificationStatus")}
                  aria-label="Sort by Verification Status"
                >
                  Verification Status
                  {sortConfig.key === "verificationStatus" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th
                  className="table-header-cell sortable"
                  onClick={() => handleSort("createdAt")}
                  aria-label="Sort by Created Date"
                >
                  Created
                  {sortConfig.key === "createdAt" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.length === 0 ? (
                <tr>
                  <td colSpan="9" className="table-cell no-data">No businesses found</td>
                </tr>
              ) : (
                filteredBusinesses.map((business, index) => (
                  <tr key={business.id} className="table-row">
                    <td className="table-cell">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(index)}
                        onChange={() => handleRowSelect(index)}
                        aria-label={`Select business ${business.businessName}`}
                        className="checkbox"
                      />
                    </td>
                    <td className="table-cell">{business.businessName}</td>
                    <td className="table-cell">{business.registrationId}</td>
                    <td className="table-cell">{business.contactEmail}</td>
                    <td className="table-cell">${business.totalRevenue.toFixed(2)} USD</td>
                    <td className="table-cell">{business.associatedUsers.join(", ")}</td>
                    <td className="table-cell">
                      <span className={`status-indicator ${business.verificationStatus.toLowerCase()}`}>
                        {business.verificationStatus}
                      </span>
                    </td>
                    <td className="table-cell">
                      {new Date(business.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleActionsClick(business)}
                        className="action-btn"
                        aria-label={`Actions for business ${business.businessName}`}
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

        {isPopupOpen && selectedBusiness && (
          <div className="popup-overlay">
            <div className="popup-content">
              <div className="popup-header">
                <h2 className="popup-title">Business Verification</h2>
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
                  <h3 className="popup-section-title">Business Details</h3>
                  <p className="popup-info"><strong>ID:</strong> {selectedBusiness.id}</p>
                  <p className="popup-info"><strong>Name:</strong> {selectedBusiness.businessName}</p>
                  <p className="popup-info"><strong>Registration ID:</strong> {selectedBusiness.registrationId}</p>
                  <p className="popup-info"><strong>Contact Email:</strong> {selectedBusiness.contactEmail}</p>
                  <p className="popup-info"><strong>Contact Phone:</strong> {selectedBusiness.contactPhone}</p>
                  <p className="popup-info"><strong>Total Revenue:</strong> ${selectedBusiness.totalRevenue.toFixed(2)} USD</p>
                  <p className="popup-info"><strong>Associated Users:</strong> {selectedBusiness.associatedUsers.join(", ")}</p>
                  <p className="popup-info"><strong>Verification Status:</strong> {selectedBusiness.verificationStatus}</p>
                  <p className="popup-info"><strong>Created:</strong>{" "}
                    {new Date(selectedBusiness.createdAt).toLocaleString("en-US", {
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
                  <h3 className="popup-section-title">Verification Document</h3>
                  <p className="popup-info">
                    <strong>Document:</strong>{" "}
                    <a href={selectedBusiness.verificationDocumentUrl} target="_blank" rel="noopener noreferrer">
                      View Business License
                    </a>
                  </p>
                </div>
                <div className="popup-section">
                  <h3 className="popup-section-title">Verification Actions</h3>
                  <button
                    onClick={() => handleVerificationAction("Approve")}
                    className="popup-btn approve"
                    aria-label="Approve business verification"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerificationAction("Reject")}
                    className="popup-btn reject"
                    aria-label="Reject business verification"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleVerificationAction("Request More Info")}
                    className="popup-btn request-info"
                    aria-label="Request more information"
                  >
                    Request More Info
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

export default BizCust;