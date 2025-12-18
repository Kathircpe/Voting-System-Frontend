import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./admin.module.css";

const Admin = () => {
  const navigate = useNavigate();
  // Auth check
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!token || !user || JSON.parse(user).id !== 1) {
      navigate("/login");
    }
  }, [navigate]);

  const [currentSection, setCurrentSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // User state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : { name: "Admin", id: 1 };
  });

  // Data states - Load on mount
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [votersData, setVotersData] = useState([]);
  const [votesData, setVotesData] = useState([]);
  const [currentPage, setCurrentPage] = useState("");
  const [votersPageSize, setVotersPageSize] = useState(10);

  // Form states
  const [electionForm, setElectionForm] = useState({
    id: "",
    electionName: "",
    startDate: "",
    endDate: "",
  });
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    partyName: "",
    id: "",
    constituency: "",
  });

  const [showElectionForm, setShowElectionForm] = useState(false);
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [votersFormType, setVotersFormType] = useState(null);

  const [showUpdateElection, setShowUpdateElection] = useState(false);
  const [showDeleteElection, setShowDeleteElection] = useState(false);
  const [showDeleteCandidate, setShowDeleteCandidate] = useState(false);
  const [showUpdateCandidate, setShowUpdateCandidate] = useState(false);

  // IDs for update/delete
  const [updateElectionId, setUpdateElectionId] = useState("");
  const [deleteElectionId, setDeleteElectionId] = useState("");
  const [updateCandidateId, setUpdateCandidateId] = useState("");
  const [deleteCandidateId, setDeleteCandidateId] = useState("");
  const [voterId, setVoterId] = useState("");
  const [secondElectionId, setSecondElectionId] = useState("");
  const [electionId, setElectionId] = useState("");
  const [candidateIdForVotes, setCandidateIdForVotes] = useState("");

  // Messages
  const [message, setMessage] = useState(null);

  const API_BASE_URL = "https://voting-system-m7jo.onrender.com/api/v1/admin";

  const apiCalls = {
    // Elections
    createElection: async (data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/createElection`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    },

    updateElection: async (data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/updateElection`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response;
    },

    deleteElection: async (electionId) => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/deleteElection/${electionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return await response.json();
    },

    getAllElections: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://voting-system-m7jo.onrender.com/api/v1/voter/election`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data.content || data;
    },

    // Candidates
    createCandidate: async (data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/createCandidate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response;
    },

    updateCandidate: async (data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/updateCandidate`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response;
    },

    deleteCandidate: async (candidateId) => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/deleteCandidate/${candidateId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return await response;
    },

    getAllCandidates: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://voting-system-m7jo.onrender.com/api/v1/voter/candidates`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data.content || data;
    },

    // Voters
    getAllVoters: async (page) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/getVoters/${page - 1}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data.content || data;
    },

    getVoterById: async (voterId) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/getVoter/${voterId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    },

    // Votes
    getAllVotes: async (electionId) => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/getVotesForAll/${electionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return await response.json();
    },

    getSingleCandidateVotes: async (id, candidateId) => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/getVotes?id=${id}&candidateId=${candidateId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const raw = await response.text();
      try {
        const parsed = raw ? JSON.parse(raw) : null;
        return parsed;
      } catch {
        return raw;
      }
    },
  };

  // Load initial data
  useEffect(() => {
    loadOverviewData();
  }, []);

  // Load data on section change
  useEffect(() => {
    if (currentSection === "elections") {
      loadElections();
    } else if (currentSection === "candidates") {
      loadCandidates();
    }
  }, [currentSection]);

  const loadOverviewData = async () => {
    try {
      const [electionsData, candidatesData] = await Promise.all([
        apiCalls.getAllElections(),
        apiCalls.getAllCandidates(),
      ]);
      setElections(Array.isArray(electionsData) ? electionsData : []);
      setCandidates(Array.isArray(candidatesData) ? candidatesData : []);
    } catch (error) {
      console.error(
        "Error loading overview:",
        error.reponse?.data || error.message
      );
    }
  };

  const loadElections = async () => {
    try {
      setLoading(true);
      const data = await apiCalls.getAllElections();
      setElections(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load elections" });
    } finally {
      setLoading(false);
    }
  };

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const data = await apiCalls.getAllCandidates();
      setCandidates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setMessage({ type: "error", text: "Failed to load candidates" });
    } finally {
      setLoading(false);
    }
  };

  const emptyElectionForm = () => {
    setElectionForm({ id: "", electionName: "", startDate: "", endDate: "" });
  };

  // Election handlers
  const handleCreateElection = async (e) => {
    e.preventDefault();
    if (
      !electionForm.electionName ||
      !electionForm.startDate ||
      !electionForm.endDate
    ) {
      setMessage({ type: "error", text: "Please fill all required fields" });
      return;
    }
    if (typeof electionForm.electionName.trim() !== "string") {
      setMessage({ type: "error", text: "Please enter a valid election name" });
      return;
    }

    try {
      setLoading(true);
      await apiCalls.createElection(electionForm);
      setMessage({ type: "success", text: "Election created successfully!" });
      emptyElectionForm();
      setTimeout(() => setMessage(null), 5000);
      loadElections();
      setShowElectionForm(false);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data || "Failed to create election",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateElection = async (e) => {
    e.preventDefault();
    if (!electionForm.id) {
      setMessage({ type: "error", text: "Please enter Election ID" });
      return;
    }
    if (isNaN(electionForm.id.trim())) {
      setMessage({ type: "error", text: "Please enter a valid number" });
      return;
    }
    if (
      !electionForm.electionName &&
      !electionForm.startDate &&
      !electionForm.endDate
    ) {
      setMessage({ type: "error", text: "Please enter atleast one detail" });
      return;
    }
    let data = { id: electionForm.id };
    if (
      electionForm.electionName.trim() &&
      typeof electionForm.id.trim() !== "string"
    ) {
      setMessage({ type: "error", text: "Please enter a valid name" });
      return;
    }

    if (electionForm.electionName.trim())
      data.electionName = electionForm.electionName.trim();
    if (electionForm.startDate) data.startDate = electionForm.startDate;
    if (electionForm.endDate) data.endDate = electionForm.endDate;

    try {
      setLoading(true);
      await apiCalls.updateElection(data);
      setMessage({
        type: "success",
        text: `Election ${electionForm.id} updated successfully!`,
      });
      setUpdateElectionId("");
      emptyElectionForm();
      setTimeout(() => setMessage(null), 5000);
      loadElections();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data || error.message || "Failed to update election",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteElection = async () => {
    if (!deleteElectionId) {
      setMessage({ type: "error", text: "Please enter Election ID" });
      return;
    }
    if (isNaN(deleteElectionId.trim())) {
      setMessage({ type: "error", text: "Please enter a valid number" });
      return;
    }
    if (!window.confirm(`Delete election ${deleteElectionId}?`)) return;

    try {
      setLoading(true);
      await apiCalls.deleteElection(electionForm.id.trim());
      setMessage({
        type: "success",
        text: `Election ${electionForm.id} deleted!`,
      });
      setDeleteElectionId("");
      setTimeout(() => setMessage(null), 5000);
      loadElections();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response.data || "Failed to delete election",
      });
    } finally {
      setLoading(false);
    }
  };

  // Candidate handlers
  const handleCreateCandidate = async (e) => {
    e.preventDefault();
    if (
      !candidateForm.name ||
      !candidateForm.partyName ||
      !candidateForm.constituency
    ) {
      setMessage({
        type: "error",
        text: "Please fill name, party, and constituency",
      });
      return;
    }
    if (typeof candidateForm.name.trim() !== "string") {
      setMessage({ type: "error", text: "Please enter a valid name" });
      return;
    }

    try {
      setLoading(true);
      const response = await apiCalls.createCandidate(candidateForm);
      setMessage({ type: "success", text: "Candidate created successfully!" });
      setCandidateForm({ id: "", name: "", partyName: "", constituency: "" });
      setTimeout(() => setMessage(null), 5000);
      loadCandidates();
      setShowCandidateForm(false);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data || "Failed to create candidate",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCandidate = async (e) => {
    e.preventDefault();
    if (!candidateForm.id) {
      setMessage({ type: "error", text: "Please enter Candidate ID" });
      return;
    }
    if (isNaN(candidateForm.id.trim())) {
      setMessage({ type: "error", text: "Please enter a valid number" });
      return;
    }
    if (
      !candidateForm.name &&
      !candidateForm.partyName &&
      !candidateForm.constituency
    ) {
      setMessage({ type: "error", text: "Please enter atleast one detail" });
      return;
    }

    let data = { id: candidateForm.id };
    if (
      candidateForm.name.trim() &&
      typeof candidateForm.name.trim() !== "string"
    ) {
      setMessage({ type: "error", text: "Please enter a valid name" });
      return;
    }
    if (candidateForm.name) data.name = candidateForm.name;
    if (candidateForm.partyName) data.partyName = candidateForm.partyName;
    if (candidateForm.constituency)
      data.constituency = candidateForm.constituency;
    try {
      setLoading(true);
      await apiCalls.updateCandidate(data);
      setMessage({
        type: "success",
        text: `Candidate ${data.id} updated successfully!`,
      });
      setUpdateCandidateId("");
      setCandidateForm({ id: "", name: "", partyName: "", constituency: "" });
      setTimeout(() => setMessage(null), 5000);
      loadCandidates();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update candidate",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async () => {
    if (!deleteCandidateId) {
      setMessage({ type: "error", text: "Please enter Candidate ID" });
      return;
    }
    if (isNaN(deleteCandidateId.trim())) {
      setMessage({ type: "error", text: "Please enter a valid number" });
      return;
    }
    if (!window.confirm(`Delete candidate ${deleteCandidateId}?`)) return;

    try {
      setLoading(true);
      await apiCalls.deleteCandidate(deleteCandidateId.trim());
      setMessage({
        type: "success",
        text: `Candidate ${deleteCandidateId} deleted!`,
      });
      setDeleteCandidateId("");
      setTimeout(() => setMessage(null), 5000);
      loadCandidates();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.reponse.data || "Failed to delete candidate",
      });
    } finally {
      setLoading(false);
    }
  };

  // Voter handlers
  const handleGetAllVoters = async () => {
    if (!currentPage.trim()) {
      setMessage({ type: "error", text: "Please enter a number" });
      return;
    }
    if (isNaN(currentPage.trim())) {
      setMessage({ type: "error", text: "Please enter a valid number" });
      return;
    }
    if (currentPage.trim() < 1) {
      setMessage({
        type: "error",
        text: "Please enter a number greater than 0",
      });
      return;
    }
    try {
      setLoading(true);
      const data = await apiCalls.getAllVoters(currentPage);
      setVotersData(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch voters" });
      setVotersData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSingleVoter = async () => {
    if (!voterId.trim()) {
      setMessage({ type: "error", text: "Please enter Voter ID" });
      return;
    }
    if (isNaN(voterId.trim())) {
      setMessage({ type: "error", text: "Please enter a valid number" });
      return;
    }
    try {
      setLoading(true);
      const data = await apiCalls.getVoterById(voterId.trim());
      // Check if data is a valid voter object
      if (data && data.id) {
        setVotersData([data]);
      } else {
        setMessage({ type: "error", text: "Voter not found" });
        setVotersData([]);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Voter not found" });
      setVotersData([]);
    } finally {
      setLoading(false);
    }
  };

  // Vote handlers
  const handleGetAllVotes = async () => {
    if (!electionId.trim()) {
      setMessage({ type: "error", text: "Please enter election Id" });
      return;
    }
    if (isNaN(electionId.trim())) {
      setMessage({ type: "error", text: "Please enter a valid number" });
      return;
    }
    try {
      setLoading(true);
      const data = await apiCalls.getAllVotes(electionId.trim());
      setVotesData(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data || "failed to fetch",
      });
      setVotesData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSingleVotes = async () => {
    if (!secondElectionId.trim() || !candidateIdForVotes.trim()) {
      setMessage({ type: "error", text: "Please fill all fields" });
      return;
    }
    if (isNaN(secondElectionId.trim()) || isNaN(candidateIdForVotes.trim())) {
      setMessage({ type: "error", text: "Please enter a number" });
      return;
    }
    try {
      setLoading(true);
      const data = await apiCalls.getSingleCandidateVotes(
        secondElectionId.trim(),
        candidateIdForVotes.trim()
      );
      if (Array.isArray(data)) {
        setVotesData(data);
      } else if (typeof data === "string") {
        setVotesData([]);
        setMessage({
          type: "error",
          text: data || "Failed to fetch candidate votes",
        });
      } else {
        setVotesData([]);
        setMessage({
          type: "error",
          text: "unexpected error",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data ||
          error.message ||
          "Failed to fetch candidate votes",
      });
      setVotesData([]);
    } finally {
      setLoading(false);
    }
  };
  const formatTime = (value) => {
    const d = new Date(value.replace(" ", "T"));
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();

    let hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    let isAm = true;
    if (hh > 11) isAm = false;
    hh = hh % 12;
    hh = !isAm && hh == 0 ? "12" : hh;
    return `${dd}/${mm}/${yyyy}, ${hh}:${min}:${ss} ${isAm ? "AM" : "PM"}`;
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={styles.adminLayout}>
      <button
        className={styles.mobileToggle}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span>Admin Portal</span>
        </div>

        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>👨‍💼</div>
          <div className={styles.userName}>{user.name}</div>
          <div className={styles.userId}>Admin ID: {user.id}</div>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navTitle}>Dashboard</div>
          <button
            className={`${styles.navItem} ${
              currentSection === "overview" ? styles.navItemActive : ""
            }`}
            onClick={() =>
              setCurrentSection(currentSection !== "overview" ? "overview" : "")
            }
          >
            <span>📊</span>
            <span>Overview</span>
          </button>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navTitle}>Management</div>
          <button
            className={`${styles.navItem} ${
              currentSection === "elections" ? styles.navItemActive : ""
            }`}
            onClick={() =>
              setCurrentSection(
                currentSection !== "elections" ? "elections" : "overview"
              )
            }
          >
            <span>🗳️</span>
            <span>Elections</span>
          </button>
          <button
            className={`${styles.navItem} ${
              currentSection === "candidates" ? styles.navItemActive : ""
            }`}
            onClick={() =>
              setCurrentSection(
                currentSection !== "candidates" ? "candidates" : "overview"
              )
            }
          >
            <span>👤</span>
            <span>Candidates</span>
          </button>
          <button
            className={`${styles.navItem} ${
              currentSection === "voters" ? styles.navItemActive : ""
            }`}
            onClick={() =>
              setCurrentSection(
                currentSection !== "voters" ? "voters" : "overview"
              )
            }
          >
            <span>👥</span>
            <span>Voters</span>
          </button>
          <button
            className={`${styles.navItem} ${
              currentSection === "votes" ? styles.navItemActive : ""
            }`}
            onClick={() =>
              setCurrentSection(
                currentSection !== "votes" ? "votes" : "overview"
              )
            }
          >
            <span>📈</span>
            <span>Vote Results</span>
          </button>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navTitle}>Account</div>
          <button className={styles.navItem} onClick={handleLogout}>
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {message && (
          <div
            className={`${styles.alert} ${
              message.type === "success"
                ? styles.alertSuccess
                : styles.alertWarning
            }`}
          >
            <span>{message.type === "success" ? "✓" : "✗"}</span>
            <span>{message.text}</span>
          </div>
        )}

        {/* Overview */}
        {currentSection === "overview" && (
          <div>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Admin Dashboard</h1>
              <p className={styles.pageSubtitle}>Manage your voting system</p>
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Elections</div>
                <div className={styles.statValue}>{elections.length}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Candidates</div>
                <div className={styles.statValue}>{candidates.length}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Active Voters</div>
                <div className={styles.statValue}>16,504</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Votes</div>
                <div className={styles.statValue}>32,139</div>
              </div>
            </div>
          </div>
        )}

        {/* Elections */}
        {currentSection === "elections" && (
          <div>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Election Management</h1>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={loadElections}
                disabled={loading}
              >
                {loading ? "Loading..." : "🔄 Refresh"}
              </button>
            </div>

            {/* CRUD BUTTONS */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <span>⚡</span> Election Management
              </h2>
              <div className={styles.crudBtnGroup}>
                <button
                  className={`${styles.btn} ${styles.crudCreateBtn}`}
                  onClick={() => setShowElectionForm(true)}
                  disabled={loading}
                >
                  ➕ Create Election
                </button>
                <button
                  className={`${styles.btn} ${styles.crudUpdateBtn}`}
                  onClick={() => setShowUpdateElection(true)}
                  disabled={loading}
                >
                  ✏️ Update Election
                </button>
                <button
                  className={`${styles.btn} ${styles.crudDeleteBtn}`}
                  onClick={() => setShowDeleteElection(true)}
                  disabled={loading}
                >
                  🗑️ Delete Election
                </button>
                <button
                  className={`${styles.btn} ${styles.crudRefreshBtn}`}
                  onClick={loadElections}
                  disabled={loading}
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Elections List */}
            {!loading && elections.length > 0 && (
              <div className={styles.sectionCard}>
                <br />
                <br />
                <h2 className={styles.sectionTitle}>
                  <span>🗳️</span> Elections List
                </h2>

                {/* responsive wrapper */}
                <div className={styles.dataTable}>
                  <table className={styles.responsiveTable}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Election Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Contract</th>
                      </tr>
                    </thead>
                    <tbody>
                      {elections
                        .sort((a, b) => a.id - b.id)
                        .map((election, idx) => (
                          <tr key={idx}>
                            <td>{election.id || idx}</td>
                            <td>{election.electionName}</td>
                            <td>{formatTime(election.startDate)}</td>
                            <td>{formatTime(election.endDate)}</td>
                            <td className={styles.contractCell}>
                              {election.contractAddress}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Election Forms */}
            {showElectionForm && (
              <div className={styles.inputForm}>
                <br />
                <h3 className={styles.formTitle}>
                  <span>➕</span> Create New Election
                </h3>
                <form onSubmit={handleCreateElection}>
                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      {/* <label className={styles.inputLabel}>Election Name</label> */}
                      <input
                        type="text"
                        className={styles.inputField}
                        value={electionForm.electionName}
                        onChange={(e) =>
                          setElectionForm({
                            ...electionForm,
                            electionName: e.target.value,
                          })
                        }
                        placeholder="Presidential, Local, etc."
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      {/* <label  className={styles.inputLabel}>Start Date</label> */}
                      <input
                        type="datetime-local"
                        className={styles.inputField}
                        value={electionForm.startDate}
                        onChange={(e) =>
                          setElectionForm({
                            ...electionForm,
                            startDate: e.target.value,
                          })
                        }
                        placeholder="Start Date"
                        title="Start Date"
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      {/* <label  className={styles.inputLabel}>End Date</label> */}
                      <input
                        type="datetime-local"
                        className={styles.inputField}
                        value={electionForm.endDate}
                        onChange={(e) =>
                          setElectionForm({
                            ...electionForm,
                            endDate: e.target.value,
                          })
                        }
                        placeholder="End Date"
                        title="End Date"
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.crudBtnGroup}>
                    <button
                      type="submit"
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Election"}
                    </button>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      onClick={() => setShowElectionForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            {/* UPDATE ELECTION */}
            {showUpdateElection && (
              <div className={styles.sectionCard}>
                <br />
                <h3 className={styles.formTitle}>✏️ Update Election</h3>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Enter Election ID (e.g., 1)"
                  value={electionForm.id}
                  onChange={(e) =>
                    setElectionForm({ ...electionForm, id: e.target.value })
                  }
                />

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    {/* <label className={styles.inputLabel}>Election Name</label> */}
                    <input
                      type="text"
                      className={styles.inputField}
                      value={electionForm.electionName}
                      onChange={(e) =>
                        setElectionForm({
                          ...electionForm,
                          electionName: e.target.value,
                        })
                      }
                      placeholder="Presidential, Local, etc."
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    {/* <label className={styles.inputLabel}>Start Date</label> */}
                    <input
                      type="text"
                      className={styles.inputField}
                      value={electionForm.startDate}
                      onChange={(e) =>
                        setElectionForm({
                          ...electionForm,
                          startDate: e.target.value,
                        })
                      }
                      placeholder="Start Date"
                      onFocus={(e) => (e.target.type = "datetime-local")}
                      onBlur={(e) => {
                        if (!e.target.value) e.target.type = "text";
                      }}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    {/* <label className={styles.inputLabel}>End Date</label> */}
                    <input
                      type="text"
                      className={styles.inputField}
                      value={electionForm.endDate}
                      onChange={(e) =>
                        setElectionForm({
                          ...electionForm,
                          endDate: e.target.value,
                        })
                      }
                      placeholder="End Date"
                      onFocus={(e) => (e.target.type = "datetime-local")}
                      onBlur={(e) => {
                        if (!e.target.value) e.target.type = "text";
                      }}
                    />
                  </div>
                </div>

                <div className={styles.crudBtnGroup}>
                  <button
                    className={`${styles.btn} ${styles.crudUpdateBtn}`}
                    onClick={handleUpdateElection}
                    disabled={loading || !electionForm.id.trim()}
                  >
                    Update Election
                  </button>
                  <button
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => setShowUpdateElection(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* DELETE ELECTION */}
            {showDeleteElection && (
              <div className={styles.deleteConfirmSection}>
                <h3 className={styles.formTitle}>🗑️ Delete Election</h3>
                <input
                  type="text"
                  className={styles.deleteIdInput}
                  placeholder="Enter Election ID to Delete"
                  value={deleteElectionId}
                  onChange={(e) => setDeleteElectionId(e.target.value)}
                />
                <div className={styles.crudBtnGroup}>
                  <button
                    className={`${styles.btn} ${styles.crudDeleteBtn}`}
                    onClick={handleDeleteElection}
                    disabled={loading || !deleteElectionId.trim()}
                  >
                    ⚠️ Confirm Delete
                  </button>
                  <button
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => setShowDeleteElection(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Candidates */}
        {currentSection === "candidates" && (
          <div>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Candidate Management</h1>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={loadCandidates}
                disabled={loading}
              >
                {loading ? "Loading..." : "🔄 Refresh"}
              </button>
            </div>

            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <span>⚡</span> Candidate Management
              </h2>
              <div className={styles.crudBtnGroup}>
                <button
                  className={`${styles.btn} ${styles.crudCreateBtn}`}
                  onClick={() => setShowCandidateForm(true)}
                >
                  ➕ Create Candidate
                </button>
                <button
                  className={`${styles.btn} ${styles.crudUpdateBtn}`}
                  onClick={() => setShowUpdateCandidate(true)}
                >
                  ✏️ Update Candidate
                </button>
                <button
                  className={`${styles.btn} ${styles.crudDeleteBtn}`}
                  onClick={() => setShowDeleteCandidate(true)}
                >
                  🗑️ Delete Candidate
                </button>
                <button
                  className={`${styles.btn} ${styles.crudRefreshBtn}`}
                  onClick={loadCandidates}
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Candidates List */}
            {!loading && candidates.length > 0 && (
              <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>
                  <br />
                  <br />
                  <span>👤</span> Candidates List
                </h2>
                <div className={styles.dataTable}>
                  <table className={styles.responsiveTable}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Constituency</th>
                        <th>Party</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates
                        .sort((a, b) => a.id - b.id)
                        .map((candidate, idx) => (
                          <tr key={idx}>
                            <td>{candidate.id || idx}</td>
                            <td className={styles.wrapCell}>
                              {candidate.name}
                            </td>
                            <td className={styles.wrapCell}>
                              {candidate.constituency}
                            </td>
                            <td className={styles.wrapCell}>
                              {candidate.partyName}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* Candidate Forms */}
            {showCandidateForm && (
              <div className={styles.inputForm}>
                <br />
                <h3 className={styles.formTitle}>
                  <span>➕</span> Create New Candidate
                </h3>
                <form onSubmit={handleCreateCandidate}>
                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      {/* <label className={styles.inputLabel}>Name</label> */}
                      <input
                        type="text"
                        className={styles.inputField}
                        value={candidateForm.name}
                        onChange={(e) =>
                          setCandidateForm({
                            ...candidateForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="Candidate full name"
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      {/* <label className={styles.inputLabel}>Party</label> */}
                      <input
                        type="text"
                        className={styles.inputField}
                        value={candidateForm.partyName}
                        onChange={(e) =>
                          setCandidateForm({
                            ...candidateForm,
                            partyName: e.target.value,
                          })
                        }
                        placeholder="Political party"
                        required
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      {/* <label className={styles.inputLabel}>Constituency</label> */}
                      <input
                        type="text"
                        className={styles.inputField}
                        value={candidateForm.constituency}
                        onChange={(e) =>
                          setCandidateForm({
                            ...candidateForm,
                            constituency: e.target.value,
                          })
                        }
                        placeholder="constituency"
                      />
                    </div>
                  </div>

                  <div className={styles.btnGroup}>
                    <button
                      type="submit"
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Candidate"}
                    </button>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      onClick={() => setShowCandidateForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* UPDATE CANDIDATE */}
            {showUpdateCandidate && (
              <div className={styles.sectionCard}>
                <br />
                <h3 className={styles.formTitle}>✏️ Update Candidate</h3>
                <input
                  type="text"
                  className={styles.updateIdInput}
                  placeholder="Enter Candidate ID (e.g., 1)"
                  value={candidateForm.id}
                  onChange={(e) =>
                    setCandidateForm({ ...candidateForm, id: e.target.value })
                  }
                />

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    {/* <label className={styles.inputLabel}>Name</label> */}
                    <input
                      type="text"
                      className={styles.inputField}
                      value={candidateForm.name}
                      onChange={(e) =>
                        setCandidateForm({
                          ...candidateForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="Candidate full name"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    {/* <label className={styles.inputLabel}>Party</label> */}
                    <input
                      type="text"
                      className={styles.inputField}
                      value={candidateForm.partyName}
                      onChange={(e) =>
                        setCandidateForm({
                          ...candidateForm,
                          partyName: e.target.value,
                        })
                      }
                      placeholder="Political party"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    {/* <label className={styles.inputLabel}>Constituency</label> */}
                    <input
                      type="text"
                      className={styles.inputField}
                      value={candidateForm.constituency}
                      onChange={(e) =>
                        setCandidateForm({
                          ...candidateForm,
                          constituency: e.target.value,
                        })
                      }
                      placeholder="constituency"
                    />
                  </div>
                </div>

                <div className={styles.crudBtnGroup}>
                  <button
                    className={`${styles.btn} ${styles.crudUpdateBtn}`}
                    onClick={handleUpdateCandidate}
                    disabled={loading || !candidateForm.id.trim()}
                  >
                    Update Candidate
                  </button>
                  <button
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => setShowUpdateCandidate(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* DELETE CANDIDATE */}
            {showDeleteCandidate && (
              <div className={styles.deleteConfirmSection}>
                <h3 className={styles.formTitle}>🗑️ Delete Candidate</h3>
                <input
                  type="text"
                  className={styles.deleteIdInput}
                  placeholder="Enter Candidate ID to Delete"
                  value={deleteCandidateId}
                  onChange={(e) => setDeleteCandidateId(e.target.value)}
                />
                <div className={styles.crudBtnGroup}>
                  <button
                    className={`${styles.btn} ${styles.crudDeleteBtn}`}
                    onClick={handleDeleteCandidate}
                    disabled={loading || !deleteCandidateId.trim()}
                  >
                    ⚠️ Confirm Delete
                  </button>
                  <button
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => setShowDeleteCandidate(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Voters */}
        {currentSection === "voters" && (
          <div>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Voter Management</h1>
            </div>

            <div className={styles.inputForm}>
              <h3 className={styles.formTitle}>
                <span>👥</span> Voter Actions
              </h3>
              <h4>#th 10 voters : </h4>
              {/* Get All Voters */}
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  {/* <label className={styles.inputLabel}>Page</label> */}
                  <input
                    type="text"
                    className={styles.inputField}
                    value={currentPage}
                    placeholder="Page Number"
                    onChange={(e) =>
                      setCurrentPage(parseInt(e.target.value) || 1)
                    }
                  />
                </div>
              </div>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleGetAllVoters}
                disabled={loading}
              >
                📋 Get All Voters
              </button>

              {/* Get Single Voter */}
              <div style={{ marginTop: "20px" }}>
                <div className={styles.formRow}>
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Voter ID"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                  />
                  <button
                    className={`${styles.btn} ${styles.btnInfo}`}
                    onClick={handleGetSingleVoter}
                    disabled={loading || !voterId.trim()}
                  >
                    🔍 Search Voter
                  </button>
                </div>
              </div>
            </div>

            {/* Voters Table */}
            {votersData.length > 0 && (
              <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>
                  <br />
                  <br />
                  <span>📋</span> Voters Data
                </h2>
                <div className={styles.dataTable}>
                  <table className={styles.responsiveTable}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>phone</th>
                        <th>has voted?</th>
                        <th>is enabled ?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {votersData
                        .sort((a, b) => a.id - b.id)
                        .map((voter, idx) => (
                          <tr key={idx}>
                            <td>{voter.id}</td>
                            <td className={styles.wrapCell}>{voter.name}</td>
                            <td className={styles.wrapCell}>{voter.email}</td>
                            <td className={styles.wrapCell}>
                              {voter.phoneNumber}
                            </td>
                            <td className={styles.wrapCell}>
                              {voter.hasVoted ? "YES" : "NO"}
                            </td>
                            <td className={styles.wrapCell}>
                              {voter.isEnabled ? "YES" : "NO"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Votes */}
        {currentSection === "votes" && (
          <div>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Vote Results</h1>
            </div>

            <div className={styles.inputForm}>
              <h3 className={styles.formTitle}>
                <span>📈</span> Vote Analytics
              </h3>

              {/* Get All Votes */}
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  {/* <label className={styles.inputLabel}>Contract Address</label> */}
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Election Id"
                    value={electionId}
                    onChange={(e) => setElectionId(e.target.value)}
                  />
                </div>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={handleGetAllVotes}
                  disabled={loading || !electionId.trim()}
                >
                  📊 Get All Votes
                </button>
              </div>

              {/* Get Single Candidate Votes */}
              <div style={{ marginTop: "20px" }}>
                <div className={styles.formRow}>
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Election Id"
                    value={secondElectionId}
                    onChange={(e) => setSecondElectionId(e.target.value)}
                  />
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Candidate ID"
                    value={candidateIdForVotes}
                    onChange={(e) => setCandidateIdForVotes(e.target.value)}
                  />
                  <button
                    className={`${styles.btn} ${styles.btnInfo}`}
                    onClick={handleGetSingleVotes}
                    disabled={
                      loading ||
                      !secondElectionId.trim() ||
                      !candidateIdForVotes.trim()
                    }
                  >
                    📈 Candidate Votes
                  </button>
                </div>
              </div>
            </div>

            {/* Votes Table */}
            {votesData.length > 0 && (
              <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>
                  <br />
                  <br />
                  <span>📊</span> Vote Results
                </h2>
                <div className={styles.dataTable}>
                  <table className={styles.responsiveTable}>
                    <thead>
                      <tr>
                        <th>Candidate ID</th>
                        <th>name</th>
                        <th>party</th>
                        <th>Votes Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {votesData.map((vote, idx) => (
                        <tr key={idx}>
                          <td className={styles.wrapCell}>{vote.id || idx}</td>
                          <td>{vote.name || 0}</td>
                          <td>{vote.partyName || 0}</td>
                          <td>{vote.votes || 0}</td>
                          <td>
                            {(
                              ((vote.votes || 0) /
                                votesData.reduce(
                                  (sum, v) => sum + (v.votes || 0),
                                  0
                                )) *
                                100 || 0
                            ).toFixed(1)}
                            %
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {sidebarOpen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Admin;
