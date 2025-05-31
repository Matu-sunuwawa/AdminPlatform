
import React, { useState, useEffect, useContext } from "react";
import "../style/css/DisputePage.css"
import { useLocation } from "react-router-dom";
import SideBar from '../component/SideBar';
import AuthContext from '../context/AuthContext';

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

const DisputesPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [disputes, setDisputes] = useState([]);
  const [filteredDisputes, setFilteredDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Needs response");
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "created",
    direction: "desc",
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showReporterPhone, setShowReporterPhone] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();

  const { disputeRecords, disputeInReview, disputeReviewed, disputeResolved } = useContext(AuthContext)

  useEffect(() => {
    setLoading(true);
    const fetchDisputes = async () => {
      try {
        const data = await disputeRecords();
        setDisputes(data);
      } catch (error) {
        console.error("Error fetching disputes:", error);
      }
    };

    Promise.all([fetchDisputes()]).finally(() =>
      setLoading(false)
    );
  }, [disputeRecords]);


  useEffect(() => {
    let filtered = [...disputes];

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
    }, [disputes, sortConfig]);



  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredDisputes.map((_, index) => index));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const handleActionsClick = (dispute) => {
    setSelectedDispute(dispute);
    setIsPopupOpen(true);
  };

  const handlePopupAction = async (action, disputeId) => {
    if (action === "Escalate") {
      const result = await disputeInReview(disputeId);
      console.log("Escalation result:", result);
    }
    else if (action === "Reviewed") {
      const result = await disputeReviewed(disputeId);
      console.log("Reviewed result:", result);
    }
    else if(action === "Return Money") {
      const result = await disputeResolved(disputeId);
      console.log("Reviewed result:", result);
    }

    window.location.reload();
  };

  const handlePhoneToggle = () => {
    setShowReporterPhone(!showReporterPhone);
    setSortConfig({
      key: showReporterPhone ? "phoneReportee" : "phoneReporter",
      direction: sortConfig.direction,
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
    <div className="disputes-page">
        <SideBar activePath={location.pathname} />

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
                {filteredDisputes && filteredDisputes.length === 0 ? (
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
                        <td className="table-cell">{dispute.transaction}</td>
                        <td className="table-cell">{dispute.phone_number}</td>
                        <td className="table-cell">{dispute.amount.toFixed(2)} ETB</td>
                        <td className="table-cell">{dispute.created_at}</td>
                        <td className="table-cell">
                            <span
                                className={`status-indicator ${dispute.status
                                .toLowerCase()
                                .replace("_", "-")}`}
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
                        <strong>Report ID:</strong> {selectedDispute.transaction}
                    </p>
                    <p className="popup-info">
                        <strong>Reporter Phone:</strong>{" "}
                        {selectedDispute.phone_number}
                    </p>
                    <p className="popup-info">
                        <strong>Amount:</strong>{" "}
                        {selectedDispute.amount.toFixed(2)} ETB
                    </p>
                    <p className="popup-info">
                        <strong>Created:</strong>{" "}
                        {formatDate(selectedDispute.created_at)}
                    </p>
                    <p className="popup-info">
                        <strong>Status:</strong> {selectedDispute.status}
                    </p>
                    <p className="popup-info">
                        <strong>Resolved:</strong>{" "}
                        {((selectedDispute.status) === "resolved") ? "Yes" : "No"}
                    </p>
                    </div>
                    <div className="popup-section">
                    <h3 className="popup-section-title">Actions</h3>
                    <button
                        onClick={() => handlePopupAction("Return Money", selectedDispute.id)}
                        className="popup-btn return-money"
                        aria-label="Return Money"
                    >
                        Return Money
                    </button>
                    <button
                      onClick={() => handlePopupAction("Escalate", selectedDispute.id)}
                      className="popup-btn escalate"
                      aria-label="Escalate Dispute"
                    >
                      Escalate
                    </button>
                    <button
                      onClick={() => handlePopupAction("Reviewed", selectedDispute.id)}
                      className="popup-btn reviewed"
                      aria-label="Reviewed Dispute"
                    >
                      Reviewed
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

export default DisputesPage;
