import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./voter.module.css";

const Voter = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  });

  const [currentSection, setCurrentSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          name: "Guest",
          id: "N/A",
          email: "N/A",
          phoneNumber: "N/A",
        };
  });

  // NEW: global message for alerts
  const [message, setMessage] = useState(null);

  // Stats State
  const [stats, setStats] = useState({
    activeElections: 3,
    votesCast: 2,
    pendingElections: 1,
    accountStatus: "Active",
  });

  // Profile State
  const [voterDetails, setVoterDetails] = useState({
    name: "N/A",
    id: "N/A",
  });
  const [searchVoterId, setSearchVoterId] = useState("");

  // Elections State (put near Candidates State)
  const [elections, setElections] = useState([]);

  // Candidates State
  const [candidates, setCandidates] = useState([]);

  // Vote Form State
  const [voteForm, setVoteForm] = useState({
    id: "",
    candidateId: "",
    confirmCandidateId: "",
  });
  const [voteMessage, setVoteMessage] = useState(null);

  // Results State
  const [results, setResults] = useState([]);
  const [resultsId, setResultsId] = useState("");

  // Update Profile State
  const [updateForm, setUpdateForm] = useState({
    id: user.id,
    name: "",
    email: "",
    phone: "",
    age: "",
    address: "",
  });
  const [updateMessage, setUpdateMessage] = useState(null);

  const API_BASE_URL = "https://voting-system-m7jo.onrender.com/api/v1/voter";

  const apiCalls = {
    getVoterDetails: async (voterId) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/${voterId.trim()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return await response.json();
    },

    getAllElections: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/election`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data.content || data; // Handle Spring Boot pagination
    },

    getAllCandidates: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data.content || data;
    },

    castVote: async (data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/vote`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response;
    },

    getVoteResults: async (electionId) => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/getVotes/${electionId.trim()}`,
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

    updateVoter: async (data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/updateVoter`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response;
    },
    getProfile: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/getProfile/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    },
  };

  useEffect(() => {
    if (currentSection === "elections" || currentSection === "overview") {
      loadElections();
      return;
    }
  }, [currentSection]);

  useEffect(() => {
    if (currentSection === "myProfile") {
      handleGetProfile();
    }
  }, [currentSection]);

  // Load candidates on mount
  useEffect(() => {
    if (currentSection === "candidates" || currentSection === "vote") {
      loadCandidates();
    }
  }, [currentSection]);

  // Handlers
  const handleGetVoterDetails = async (voterId) => {
    if (!voterId.trim()) {
      setMessage({ type: "error", text: "Please enter your Voter ID" });
      return;
    }
    if (voterId.trim() && isNaN(voterId.trim())) {
      setMessage({ type: "error", text: "Enter a valid number" });
      return;
    }

    try {
      setLoading(true);
      const data = await apiCalls.getVoterDetails(voterId);
      setVoterDetails(data);
      setMessage(null);
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.response?.data || "Failed to fetch voter details",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadElections = async () => {
    try {
      setLoading(true);
      const data = await apiCalls.getAllElections();
      setElections(data.content || data);
      setMessage(null);
    } catch (error) {
      console.error("Error fetching elections:", error);
      setMessage({ type: "error", text: "Error fetching elections" });
    } finally {
      setLoading(false);
    }
  };

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const data = await apiCalls.getAllCandidates();
      setCandidates(data.content || data);
      setMessage(null);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setMessage({ type: "error", text: "Error fetching candidates" });
    } finally {
      setLoading(false);
    }
  };

  const handleCastVote = async (e) => {
    e.preventDefault();
    if (user.hasVoted) {
      setMessage({
        type: "error",
        text: "You have already voted in the election!",
      });
      return;
    }
    if (!voteForm.id || !voteForm.candidateId || !voteForm.confirmCandidateId) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }
    if (isNaN(voteForm.id.trim()) || isNaN(voteForm.candidateId.trim())) {
      setMessage({
        type: "error",
        text: "please enter a valid number",
      });
      return;
    }
    if (voteForm.confirmCandidateId !== voteForm.candidateId) {
      setMessage({
        type: "error",
        text: "Confirmation does not match selected candidate ID",
      });
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to vote for candidate ${voteForm.candidateId}? This action cannot be undone.`
      )
    ) {
      return;
    }
    const data = {
      id: voteForm.id,
      candidateId: voteForm.candidateId,
      voterId: user.id,
    };

    try {
      setLoading(true);
      await apiCalls.castVote(data);
      setVoteMessage({
        type: "success",
        text: "Your vote has been successfully recorded! Thank you for participating.",
      });
      handleGetProfile();
      setVoteForm({ id: "", candidateId: "", confirmCandidateId: "" });
      setTimeout(() => setVoteMessage(null), 7000);
      setMessage(null);
    } catch (error) {
      setVoteMessage({
        type: "error",
        text:
          error.response?.data ||
          error.message ||
          "Failed to cast vote. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetResults = async () => {
    if (!resultsId.trim()) {
      setMessage({ type: "error", text: "Please enter election id" });
      return;
    }
    if (isNaN(resultsId.trim())) {
      setMessage({ type: "error", text: "Please enter a valid number" });
      return;
    }
    try {
      setLoading(true);
      const data = await apiCalls.getVoteResults(resultsId);
      setResults(data);
      setMessage(null);
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.response?.data || "Failed to fetch vote results",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const updateData = {};
    updateData.id = updateForm.id;
    if (updateForm.name.trim()) updateData.name = updateForm.name.trim();
    if (updateForm.email.trim()) updateData.email = updateForm.email.trim();
    if (updateForm.phone.trim())
      updateData.phoneNumber = updateForm.phone.trim();
    if (updateForm.age && isNaN(updateForm.age.trim())) {
      setMessage({ type: "error", text: "Enter a valid number for age" });
      return;
    }
    if (updateForm.age) updateData.age = parseInt(updateForm.age);
    if (updateForm.address.trim())
      updateData.address = updateForm.address.trim();

    if (Object.keys(updateData).length === 1) {
      // only id present
      setMessage({ type: "error", text: "Please fill at least one field" });
      return;
    }
    if (
      updateData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)
    ) {
      setMessage({ type: "error", text: "Invalid email" });
      return;
    }
    if (
      updateData.phone &&
      typeof updateData.phone === "number" &&
      (updateData.phone.length !== 10 || !/^\d+$/.test(updateData.phone))
    ) {
      setMessage({ type: "error", text: "Valid 10-digit phone required" });
      return;
    }
    if (updateData.age && updateData.age < 18) {
      setMessage({ type: "error", text: "Must be 18+" });
      return;
    }

    try {
      setLoading(true);
      await apiCalls.updateVoter(updateData);
      setUpdateMessage({
        type: "success",
        text: "Profile updated successfully! Changes will be reflected shortly.",
      });
      handleGetProfile();
      setTimeout(() => setUpdateMessage(null), 5000);
      setMessage(null);
    } catch (error) {
      setUpdateMessage({
        type: "error",
        text:
          error?.response?.data ||
          "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleGetProfile = async () => {
    try {
      setLoading(true);
      const response = await apiCalls.getProfile();
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
      setTimeout(() => setUpdateMessage(null), 5000);
      setMessage(null);
    } catch (error) {
      setUpdateMessage({
        type: "error",
        text: error.message || "Failed to load profile. Please try again.",
      });
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
  return (
    <div className={styles.layout}>
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
          <span className={styles.logoIcon}>🗳️</span>
          <span>VotePortal</span>
        </div>

        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>👤</div>
          <div className={styles.userName}>{user.name}</div>
          <div className={styles.userId}>Voter ID: {user.id}</div>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navTitle}>Dashboard</div>
          <button
            className={`${styles.navItem} ${
              currentSection === "overview" ? styles.navItemActive : ""
            }`}
            onClick={() => setCurrentSection("overview")}
          >
            <span>📊</span>
            <span>Overview</span>
          </button>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navTitle}>Actions</div>
          <button
            className={`${styles.navItem} ${
              currentSection === "myProfile" ? styles.navItemActive : ""
            }`}
            onClick={() => setCurrentSection("myProfile")}
          >
            <span>👤</span>
            <span>My Profile</span>
          </button>
          <button
            className={`${styles.navItem} ${
              currentSection === "candidates" ? styles.navItemActive : ""
            }`}
            onClick={() => setCurrentSection("candidates")}
          >
            <span>👥</span>
            <span>View Candidates</span>
          </button>
          <button
            className={`${styles.navItem} ${
              currentSection === "elections" ? styles.navItemActive : ""
            }`}
            onClick={() => setCurrentSection("elections")}
          >
            <span>🗂️</span>
            <span>View Elections</span>
          </button>

          <button
            className={`${styles.navItem} ${
              currentSection === "vote" ? styles.navItemActive : ""
            }`}
            onClick={() => setCurrentSection("vote")}
          >
            <span>🗳️</span>
            <span>Cast Vote</span>
          </button>
          <button
            className={`${styles.navItem} ${
              currentSection === "results" ? styles.navItemActive : ""
            }`}
            onClick={() => setCurrentSection("results")}
          >
            <span>📈</span>
            <span>Vote Results</span>
          </button>
          <button
            className={`${styles.navItem} ${
              currentSection === "searchVoter" ? styles.navItemActive : ""
            }`}
            onClick={() => setCurrentSection("searchVoter")}
          >
            <span>🔍</span>
            <span>Search Voter</span>
          </button>
          <button
            className={`${styles.navItem} ${
              currentSection === "update" ? styles.navItemActive : ""
            }`}
            onClick={() => setCurrentSection("update")}
          >
            <span>✏️</span>
            <span>Update Profile</span>
          </button>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navTitle}>Account</div>
          <button
            className={styles.navItem}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* GLOBAL MESSAGE */}
        {message && (
          <div
            className={`${styles.alert} ${
              message.type === "error" ? styles.alertWarning : styles.alertInfo
            }`}
          >
            <span>{message.type === "error" ? "✗" : "ℹ️"}</span>
            <span>{message.text}</span>
          </div>
        )}

        {/* Overview Section */}
        {currentSection === "overview" && (
          <div>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>Welcome Back, {user.name}!</h1>
                <p className={styles.pageSubtitle}>
                  Your voting dashboard is ready
                </p>
              </div>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => setCurrentSection("vote")}
              >
                🗳️ Quick Vote
              </button>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Elections</div>
                <div className={styles.statValue}>{elections.length}</div>
                <div
                  className={`${styles.statTrend} ${styles.statTrendPositive}`}
                >
                  ↗ 1 new this week
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Votes Cast</div>
                <div className={styles.statValue}>2,47,234</div>
                <div
                  className={`${styles.statTrend} ${styles.statTrendPositive}`}
                >
                  ✓ Verified
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Pending Elections</div>
                <div className={styles.statValue}>{stats.pendingElections}</div>
                <div
                  className={`${styles.statTrend} ${styles.statTrendWarning}`}
                >
                  ⏰ Ends soon
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Account Status</div>
                <div className={styles.statValue}>
                  <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                    {stats.accountStatus}
                  </span>
                </div>
                <div
                  className={`${styles.statTrend} ${styles.statTrendPositive}`}
                >
                  ✓ Verified Voter
                </div>
              </div>
            </div>

            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <span>⚡</span>
                Quick Actions
              </h2>

              <div className={styles.actionGrid}>
                <div
                  className={styles.actionCard}
                  onClick={() => setCurrentSection("myProfile")}
                >
                  <div className={styles.actionIcon}>👤</div>
                  <div>
                    <div className={styles.actionTitle}>View Profile</div>
                    <div className={styles.actionDescription}>
                      See your voter details
                    </div>
                  </div>
                </div>
                <div
                  className={styles.actionCard}
                  onClick={() => setCurrentSection("candidates")}
                >
                  <div className={styles.actionIcon}>👥</div>
                  <div>
                    <div className={styles.actionTitle}>View Candidates</div>
                    <div className={styles.actionDescription}>
                      Browse all candidates
                    </div>
                  </div>
                </div>
                <div
                  className={styles.actionCard}
                  onClick={() => setCurrentSection("vote")}
                >
                  <div className={styles.actionIcon}>🗳️</div>
                  <div>
                    <div className={styles.actionTitle}>Cast Vote</div>
                    <div className={styles.actionDescription}>
                      Participate in elections
                    </div>
                  </div>
                </div>
                <div
                  className={styles.actionCard}
                  onClick={() => setCurrentSection("results")}
                >
                  <div className={styles.actionIcon}>📈</div>
                  <div>
                    <div className={styles.actionTitle}>View Results</div>
                    <div className={styles.actionDescription}>
                      Check vote counts
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Profile Section - Local Storage Data */}
        {currentSection === "myProfile" && (
          <div>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>My Profile</h1>
                <p className={styles.pageSubtitle}>Your voter information</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Voter ID</span>
                <span className={styles.infoValue}>{user.id}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Name</span>
                <span className={styles.infoValue}>{user.name}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{user.email}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Phone</span>
                <span className={styles.infoValue}>{user.phoneNumber}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>age</span>
                <span className={styles.infoValue}>{user.age}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Has Voted</span>
                <span className={styles.infoValue}>
                  {user.hasVoted ? "Yes" : "No"}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>
                  Ethereum wallet Address
                </span>
                <span className={styles.infoValue} style={{ fontSize: "12px" }}>
                  {user.voterAddress}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Account Status</span>
                <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                  Active
                </span>
              </div>
              <div className={`${styles.infoRow} ${styles.infoRowLast}`}>
                <span className={styles.infoLabel}>Last Login</span>
                <span className={styles.infoValue}>
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <span>✏️</span>
                Quick Actions
              </h2>
              <div className={styles.actionGrid}>
                <div
                  className={styles.actionCard}
                  onClick={() => setCurrentSection("update")}
                >
                  <div className={styles.actionIcon}>🔧</div>
                  <div>
                    <div className={styles.actionTitle}>Update Profile</div>
                    <div className={styles.actionDescription}>
                      Modify your details
                    </div>
                  </div>
                </div>
                <div
                  className={styles.actionCard}
                  onClick={() => setCurrentSection("searchVoter")}
                >
                  <div className={styles.actionIcon}>🔍</div>
                  <div>
                    <div className={styles.actionTitle}>
                      Search Other Voters
                    </div>
                    <div className={styles.actionDescription}>
                      Find voter by ID
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Search Voter Section - API Lookup */}
        {currentSection === "searchVoter" && (
          <div>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>Search Voter</h1>
                <p className={styles.pageSubtitle}>Find voter details by ID</p>
              </div>
            </div>

            <div className={styles.inputForm}>
              <h3 className={styles.formTitle}>
                <span>🔍</span>
                Search Voter Details
              </h3>

              <input
                type="text"
                className={styles.inputField}
                placeholder="Enter Voter ID to search"
                value={searchVoterId}
                onChange={(e) => setSearchVoterId(e.target.value)}
                onBlur={() => handleGetVoterDetails(searchVoterId)}
              />

              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => handleGetVoterDetails(searchVoterId)} //  Uses input value
                disabled={loading || !searchVoterId.trim()}
              >
                {loading ? "Searching..." : "🔍 Search Voter"}
              </button>
            </div>

            {voterDetails && (
              <div className={styles.infoCard}>
                {/* Same voterDetails display as before */}
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Voter ID</span>
                  <span className={styles.infoValue}>{voterDetails.id}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Name</span>
                  <span className={styles.infoValue}>{voterDetails.name}</span>
                </div>
                {/* ... rest of voterDetails fields ... */}
              </div>
            )}
          </div>
        )}

        {/* Elections Section */}
        {currentSection === "elections" && (
          <div>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>Elections</h1>
                <p className={styles.pageSubtitle}>
                  View all active and past elections
                </p>
              </div>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={loadElections}
                disabled={loading}
              >
                {loading ? "Loading..." : "🔄 Refresh List"}
              </button>
            </div>

            {loading ? (
              <div className={styles.loadingText}>Loading elections...</div>
            ) : (
              <div className={styles.electionsGrid}>
                {elections
                  .sort((a, b) => a.id - b.id)
                  .map((election, idx) => (
                    <div key={idx} className={styles.electionCard}>
                      <div className={styles.electionHeader}>
                        <div className={styles.electionTitle}>
                          {election.title}
                        </div>
                        <span
                          className={`${styles.badge} ${styles.badgePrimary}`}
                        >
                          {election.status}
                        </span>
                      </div>

                      <div className={styles.electionBody}>
                        <div className={styles.electionMeta}>
                          <span>ID : {election.id}</span>
                          <span>Contract : {election.contractAddress}</span>
                          <span>Type : {election.electionName}</span>
                        </div>

                        <div className={styles.electionDates}>
                          <span>Starts : {formatTime(election.startDate)}</span>
                          <span>Ends : {formatTime(election.endDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {!loading && elections.length === 0 && (
              <div className={styles.loadingText}>No elections found</div>
            )}
          </div>
        )}

        {/* Candidates Section */}
        {currentSection === "candidates" && (
          <div>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>Candidates</h1>
                <p className={styles.pageSubtitle}>
                  View all registered candidates
                </p>
              </div>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={loadCandidates}
                disabled={loading}
              >
                {loading ? "Loading..." : "🔄 Refresh List"}
              </button>
            </div>

            {loading ? (
              <div className={styles.loadingText}>Loading candidates...</div>
            ) : (
              <div className={styles.candidatesGrid}>
                {candidates
                  .sort((a, b) => a.id - b.id)
                  .map((candidate, idx) => (
                    <div key={idx} className={styles.candidateCard}>
                      <div className={styles.candidateHeader}>
                        <div className={styles.candidateAvatar}>
                          {candidate.name.charAt(0)}
                        </div>
                        <div>
                          <div className={styles.candidateName}>
                            {candidate.name}
                          </div>
                          <div className={styles.candidateParty}>
                            party : {candidate.partyName}
                          </div>
                          <div className={styles.candidateParty}>
                            constituency : {candidate.constituency}
                          </div>
                        </div>
                      </div>
                      <div className={styles.candidateBody}>
                        <div className={styles.candidateBadges}>
                          <span
                            className={`${styles.badge} ${styles.badgePrimary}`}
                          >
                            {candidate.position}
                          </span>
                          <span
                            className={`${styles.badge} ${styles.badgeInfo}`}
                          >
                            ID: {candidate.id}
                          </span>
                        </div>
                        <div className={styles.candidateBio}>
                          {candidate.bio}
                        </div>
                        {candidate.votes !== undefined && (
                          <div className={styles.candidateVotes}>
                            <span>Current Votes:</span>
                            <span className={styles.voteCount}>
                              {candidate.votes.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {!loading && candidates.length === 0 && (
              <div className={styles.loadingText}>No candidates found</div>
            )}
          </div>
        )}

        {/* Cast Vote Section */}
        {currentSection === "vote" && (
          <div>
            <h1 className={styles.pageTitle}>Cast Your Vote</h1>
            <p className={styles.pageSubtitle}>Make your voice heard</p>

            <div className={styles.inputForm}>
              <h3 className={styles.formTitle}>
                <span>🗳️</span>
                Vote Now
              </h3>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={loadCandidates}
                disabled={loading}
              >
                🔄 Refresh
              </button>

              <div className={`${styles.alert} ${styles.alertInfo}`}>
                <span>ℹ️</span>
                <span>
                  Your vote is anonymous and cannot be changed once submitted.
                </span>
              </div>

              <form onSubmit={handleCastVote}>
                {/* <label className={styles.label}>id</label> */}
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Enter election id"
                  value={voteForm.id}
                  onChange={(e) =>
                    setVoteForm({ ...voteForm, id: e.target.value })
                  }
                  required
                />

                {/* <label className={styles.label}>Select Candidate *</label> */}
                <select
                  className={styles.inputField}
                  value={voteForm.candidateId}
                  onChange={(e) =>
                    setVoteForm({ ...voteForm, candidateId: e.target.value })
                  }
                  required
                >
                  <option value="">Choose a candidate...</option>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} - {c.name} - {c.constituency} - {c.partyName}
                    </option>
                  ))}
                </select>

                {/* <label className={styles.label}>Confirm Your Choice *</label> */}
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Type candidate ID to confirm"
                  value={voteForm.confirmCandidateId}
                  onChange={(e) =>
                    setVoteForm({
                      ...voteForm,
                      confirmCandidateId: e.target.value,
                    })
                  }
                  required
                />
                {voteForm.candidateId && (
                  <small className={styles.helpText}>
                    Please type: {voteForm.candidateId}
                  </small>
                )}

                <div className={styles.btnGroup}>
                  <button
                    type="submit"
                    className={`${styles.btn} ${styles.btnSuccess}`}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "✓ Submit Vote"}
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() =>
                      setVoteForm({
                        id: "",
                        candidateId: "",
                        confirmCandidateId: "",
                      })
                    }
                  >
                    ✗ Cancel
                  </button>
                </div>
              </form>

              {voteMessage && (
                <div
                  className={`${styles.alert} ${
                    voteMessage.type === "success"
                      ? styles.alertSuccess
                      : styles.alertWarning
                  }`}
                >
                  <span>{voteMessage.type === "success" ? "✓" : "✗"}</span>
                  <span>{voteMessage.text}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Section */}
        {currentSection === "results" && (
          <div>
            <h1 className={styles.pageTitle}>Vote Results</h1>
            <p className={styles.pageSubtitle}>View election outcomes</p>

            <div className={styles.inputForm}>
              <h3 className={styles.formTitle}>
                <span>📈</span>
                Get Vote Results
              </h3>

              <input
                type="text"
                className={styles.inputField}
                placeholder="Enter election id"
                value={resultsId}
                onChange={(e) => setResultsId(e.target.value)}
              />

              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleGetResults}
                disabled={loading}
              >
                {loading ? "Loading..." : "📊 Get Results"}
              </button>
            </div>

            <div className={styles.voteResults}>
              {results.length > 0 ? (
                (() => {
                  const parsed = results.map((r) => ({
                    candidateId: r.id,
                    name: r.name,
                    partyName: r.partyName,
                    votes: r.votes,
                  }));

                  const totalVotes = parsed.reduce(
                    (sum, r) => sum + r.votes,
                    0
                  );
                  const sorted = [...parsed].sort((a, b) => b.votes - a.votes);

                  return (
                    <>
                      <div className={styles.tableContainer}>
                        <table className={styles.electionTable}>
                          <thead>
                            <tr>
                              <th className={styles.tableHeader}>Rank</th>
                              <th className={styles.tableHeader}>Candidate</th>
                              <th className={styles.tableHeader}>Party</th>
                              <th className={styles.tableHeader}>Votes</th>
                              <th className={styles.tableHeader}>%</th>
                              <th className={styles.tableHeader}>Progress</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sorted.map((row, index) => {
                              const percentage =
                                totalVotes > 0
                                  ? ((row.votes / totalVotes) * 100).toFixed(1)
                                  : 0;

                              return (
                                <tr
                                  key={row.candidateId}
                                  className={styles.tableRow}
                                >
                                  <td className={styles.tableCell}>
                                    <strong>#{index + 1}</strong>
                                  </td>
                                  <td className={styles.tableCell}>
                                    <div className={styles.candidateName}>
                                      <strong>{row.name}</strong>
                                      <span className={styles.candidateId}>
                                        #{row.candidateId}
                                      </span>
                                    </div>
                                  </td>
                                  <td className={styles.tableCell}>
                                    <span className={styles.partyBadge}>
                                      {row.partyName}
                                    </span>
                                  </td>
                                  <td
                                    className={`${styles.tableCell} ${styles.votesCell}`}
                                  >
                                    {row.votes.toLocaleString()}
                                  </td>
                                  <td className={styles.tableCell}>
                                    <span
                                      className={`${styles.badge} ${styles.badgeInfo}`}
                                    >
                                      {percentage}%
                                    </span>
                                  </td>
                                  <td className={styles.tableCell}>
                                    <div className={styles.progressBar}>
                                      <div
                                        className={styles.progressFill}
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className={styles.infoCard}>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel}>
                            Total Votes Cast
                          </span>
                          <span
                            className={`${styles.infoValue} ${styles.infoValueLarge}`}
                          >
                            {totalVotes.toLocaleString()}
                          </span>
                        </div>
                        <div className={styles.infoRow}>
                          <span className={styles.infoLabel}>
                            Leading Candidate
                          </span>
                          <span className={styles.infoValue}>
                            {sorted[0]?.name || "N/A"}
                          </span>
                        </div>
                        <div
                          className={`${styles.infoRow} ${styles.infoRowLast}`}
                        >
                          <span className={styles.infoLabel}>
                            Leading Party
                          </span>
                          <span className={styles.infoValue}>
                            {sorted[0]?.partyName || "N/A"}
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()
              ) : (
                <div className={styles.noResults}></div>
              )}
            </div>
          </div>
        )}

        {/* Update Profile Section */}
        {currentSection === "update" && (
          <div>
            <h1 className={styles.pageTitle}>Update Profile</h1>
            <p className={styles.pageSubtitle}>Modify your voter information</p>

            <div className={styles.inputForm}>
              <h3 className={styles.formTitle}>
                <span>✏️</span>
                Update Your Details
              </h3>

              <div className={`${styles.alert} ${styles.alertWarning}`}>
                <span>⚠️</span>
                <span>
                  Please ensure all information is accurate. Changes may require
                  re-verification.
                </span>
              </div>

              <form onSubmit={handleUpdateProfile}>
                {/* <label className={styles.label}>Voter ID (Cannot be changed)</label> */}
                {/* <input
                  type="text"
                  className={`${styles.inputField} ${styles.inputFieldDisabled}`}
                  value={user.id}
                  disabled
                /> */}

                <div className={styles.formRow}>
                  <div>
                    {/* <label className={styles.label}>Full Name </label> */}
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder="Full name"
                      value={updateForm.name}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={styles.label}></label>
                    <input
                      type="email"
                      className={styles.inputField}
                      placeholder="email : john@example.com"
                      value={updateForm.email}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div>
                    <label className={styles.label}></label>
                    <input
                      type="tel"
                      className={styles.inputField}
                      placeholder="mobile number"
                      maxLength="10"
                      value={updateForm.phone}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={styles.label}></label>
                    <input
                      type="number"
                      className={styles.inputField}
                      placeholder="age"
                      min="18"
                      value={updateForm.age}
                      onChange={(e) =>
                        setUpdateForm({ ...updateForm, age: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* <label className={styles.label}>Voter Address </label> */}
                <textarea
                  className={`${styles.inputField} ${styles.textArea}`}
                  placeholder="Enter your Ethereum wallet address"
                  value={updateForm.address}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, address: e.target.value })
                  }
                />

                <div className={styles.btnGroup}>
                  <button
                    type="submit"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "💾 Save Changes"}
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() =>
                      setUpdateForm({
                        name: "",
                        email: "",
                        phone: "",
                        age: "",
                        address: "",
                      })
                    }
                  >
                    ↻ Reset
                  </button>
                </div>
              </form>

              {updateMessage && (
                <div
                  className={`${styles.alert} ${
                    updateMessage.type === "success"
                      ? styles.alertSuccess
                      : styles.alertWarning
                  }`}
                >
                  <span>{updateMessage.type === "success" ? "✓" : "✗"}</span>
                  <span>{updateMessage.text}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Voter;
