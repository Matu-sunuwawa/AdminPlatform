

import React, { useState, useEffect, useContext } from "react";
import "../style/css/BusinessPage.css";
import { useLocation } from "react-router-dom";
import SideBar from '../component/SideBar';
import AuthContext from '../context/AuthContext';

const BusinessPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [businesses, setBusinesses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);

  const location = useLocation();

  const { businessRecords } = useContext(AuthContext)

  useEffect(() => {
    setLoading(true);
    const fetchBusinesses = async () => {
      try {
        const data = await businessRecords();
        setBusinesses(data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      }
    };

    Promise.all([fetchBusinesses()]).finally(() => setLoading(false));
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
            <input
                type="text"
                placeholder="Search by any field"
                className="search-bar"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search businesses"
            />
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
                    onClick={() => handleSort("verificationStatus")}
                    aria-label="Sort by Verification Status"
                    >
                    Verification Status
                    {sortConfig.key === "verificationStatus" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
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
                            aria-label={`Select business ${business.name}`}
                            className="checkbox"
                        />
                        </td>
                        <td className="table-cell">{business.name}</td>
                        <td className="table-cell">{business.id}</td>
                        <td className="table-cell">{business.contact_email}</td>
                        <td className="table-cell">
                        <span className={`status-indicator ${business.trust_level.toLowerCase()}`}>
                            {business.trust_level}
                        </span>
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
                    <p className="popup-info"><strong>Total Revenue:</strong> ${selectedBusiness.totalRevenue} ETB</p>
                    {/* <p className="popup-info"><strong>Associated Users:</strong> {selectedBusiness.associatedUsers.join(", ")}</p> */}
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
        </div>
    </div>
  );
};

export default BusinessPage;