import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './admin.module.css';

const Admin = () => {
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!token || !user || JSON.parse(user).id !== 1) {
      navigate('/login');
    }
  }, [navigate]);

  const [currentSection, setCurrentSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // User state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { name: 'Admin', id: 1 };
  });

  // Data states - Load on mount
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [votersData, setVotersData] = useState([]);
  const [votesData, setVotesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [votersPageSize, setVotersPageSize] = useState(10);

  // Form states
  const [electionForm, setElectionForm] = useState({
    title: '', type: '', startDate: '', endDate: '', description: ''
  });
  const [candidateForm, setCandidateForm] = useState({
    name: '', party: '', electionId: '', position: '', bio: ''
  });
  const [showElectionForm, setShowElectionForm] = useState(false);
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [votersFormType, setVotersFormType] = useState(null);

  // IDs for update/delete
  const [updateElectionId, setUpdateElectionId] = useState('');
  const [deleteElectionId, setDeleteElectionId] = useState('');
  const [updateCandidateId, setUpdateCandidateId] = useState('');
  const [deleteCandidateId, setDeleteCandidateId] = useState('');
  const [voterId, setVoterId] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [candidateIdForVotes, setCandidateIdForVotes] = useState('');

  // Messages
  const [message, setMessage] = useState(null);

  const API_BASE_URL = 'https://voting-system-aztp.onrender.com/api/v1/admin';

  const apiCalls = {
    // Elections
    createElection: async (data) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/election`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    },

    updateElection: async (electionId, data) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/election/${electionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    },

    deleteElection: async (electionId) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/election/${electionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    },

    getAllElections: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/election`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data.content || data;
    },

    // Candidates
    createCandidate: async (data) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    },

    updateCandidate: async (candidateId, data) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    },

    deleteCandidate: async (candidateId) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return await response.json();
    },

    getAllCandidates: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data.content || data;
    },

    // Voters
    getAllVoters: async (page = 1, size = 10) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/voters?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data.content || data;
    },

    getVoterById: async (voterId) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/voters/${voterId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    },

    // Votes
    getAllVotes: async (contractAddress) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/getVotes/${contractAddress}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    },

    getSingleCandidateVotes: async (contractAddress, candidateId) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/getVotes/${contractAddress}/${candidateId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    }
  };

  // Load initial data
  useEffect(() => {
    loadOverviewData();
  }, []);

  // Load data on section change
  useEffect(() => {
    if (currentSection === 'elections') {
      loadElections();
    } else if (currentSection === 'candidates') {
      loadCandidates();
    }
  }, [currentSection]);

  const loadOverviewData = async () => {
    try {
      const [electionsData, candidatesData] = await Promise.all([
        apiCalls.getAllElections(),
        apiCalls.getAllCandidates()
      ]);
      setElections(Array.isArray(electionsData) ? electionsData : []);
      setCandidates(Array.isArray(candidatesData) ? candidatesData : []);
    } catch (error) {
      console.error('Error loading overview:', error);
    }
  };

  const loadElections = async () => {
    try {
      setLoading(true);
      const data = await apiCalls.getAllElections();
      setElections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching elections:', error);
      setMessage({ type: 'error', text: 'Failed to load elections' });
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
      console.error('Error fetching candidates:', error);
      setMessage({ type: 'error', text: 'Failed to load candidates' });
    } finally {
      setLoading(false);
    }
  };

  // Election handlers
  const handleCreateElection = async (e) => {
    e.preventDefault();
    if (!electionForm.title || !electionForm.type || !electionForm.startDate || !electionForm.endDate) {
      setMessage({ type: 'error', text: 'Please fill all required fields' });
      return;
    }

    try {
      setLoading(true);
      await apiCalls.createElection(electionForm);
      setMessage({ type: 'success', text: 'Election created successfully!' });
      setElectionForm({ title: '', type: '', startDate: '', endDate: '', description: '' });
      setTimeout(() => setMessage(null), 5000);
      loadElections();
      setShowElectionForm(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to create election' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateElection = async (e) => {
    e.preventDefault();
    if (!updateElectionId) {
      setMessage({ type: 'error', text: 'Please enter Election ID' });
      return;
    }

    try {
      setLoading(true);
      await apiCalls.updateElection(updateElectionId.trim(), electionForm);
      setMessage({ type: 'success', text: `Election ${updateElectionId} updated successfully!` });
      setUpdateElectionId('');
      setElectionForm({ title: '', type: '', startDate: '', endDate: '', description: '' });
      setTimeout(() => setMessage(null), 5000);
      loadElections();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update election' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteElection = async () => {
    if (!deleteElectionId) {
      setMessage({ type: 'error', text: 'Please enter Election ID' });
      return;
    }
    if (!window.confirm(`Delete election ${deleteElectionId}?`)) return;

    try {
      setLoading(true);
      await apiCalls.deleteElection(deleteElectionId.trim());
      setMessage({ type: 'success', text: `Election ${deleteElectionId} deleted!` });
      setDeleteElectionId('');
      setTimeout(() => setMessage(null), 5000);
      loadElections();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete election' });
    } finally {
      setLoading(false);
    }
  };

  // Candidate handlers
  const handleCreateCandidate = async (e) => {
    e.preventDefault();
    if (!candidateForm.name || !candidateForm.party || !candidateForm.electionId) {
      setMessage({ type: 'error', text: 'Please fill name, party, and election ID' });
      return;
    }

    try {
      setLoading(true);
      await apiCalls.createCandidate(candidateForm);
      setMessage({ type: 'success', text: 'Candidate created successfully!' });
      setCandidateForm({ name: '', party: '', electionId: '', position: '', bio: '' });
      setTimeout(() => setMessage(null), 5000);
      loadCandidates();
      setShowCandidateForm(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to create candidate' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCandidate = async (e) => {
    e.preventDefault();
    if (!updateCandidateId) {
      setMessage({ type: 'error', text: 'Please enter Candidate ID' });
      return;
    }

    try {
      setLoading(true);
      await apiCalls.updateCandidate(updateCandidateId.trim(), candidateForm);
      setMessage({ type: 'success', text: `Candidate ${updateCandidateId} updated successfully!` });
      setUpdateCandidateId('');
      setCandidateForm({ name: '', party: '', electionId: '', position: '', bio: '' });
      setTimeout(() => setMessage(null), 5000);
      loadCandidates();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update candidate' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async () => {
    if (!deleteCandidateId) {
      setMessage({ type: 'error', text: 'Please enter Candidate ID' });
      return;
    }
    if (!window.confirm(`Delete candidate ${deleteCandidateId}?`)) return;

    try {
      setLoading(true);
      await apiCalls.deleteCandidate(deleteCandidateId.trim());
      setMessage({ type: 'success', text: `Candidate ${deleteCandidateId} deleted!` });
      setDeleteCandidateId('');
      setTimeout(() => setMessage(null), 5000);
      loadCandidates();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete candidate' });
    } finally {
      setLoading(false);
    }
  };

  // Voter handlers
  const handleGetAllVoters = async () => {
    try {
      setLoading(true);
      const data = await apiCalls.getAllVoters(currentPage, votersPageSize);
      setVotersData(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch voters' });
      setVotersData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSingleVoter = async () => {
    if (!voterId.trim()) {
      setMessage({ type: 'error', text: 'Please enter Voter ID' });
      return;
    }
    try {
      setLoading(true);
      const data = await apiCalls.getVoterById(voterId.trim());
      setVotersData([data]);
    } catch (error) {
      setMessage({ type: 'error', text: 'Voter not found' });
      setVotersData([]);
    } finally {
      setLoading(false);
    }
  };

  // Vote handlers
  const handleGetAllVotes = async () => {
    if (!contractAddress.trim()) {
      setMessage({ type: 'error', text: 'Please enter contract address' });
      return;
    }
    try {
      setLoading(true);
      const data = await apiCalls.getAllVotes(contractAddress.trim());
      setVotesData(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch votes' });
      setVotesData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSingleVotes = async () => {
    if (!contractAddress.trim() || !candidateIdForVotes.trim()) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }
    try {
      setLoading(true);
      const data = await apiCalls.getSingleCandidateVotes(contractAddress.trim(), candidateIdForVotes.trim());
      setVotesData(Array.isArray(data) ? [data] : []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch candidate votes' });
      setVotesData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
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
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
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
            className={`${styles.navItem} ${currentSection === 'overview' ? styles.navItemActive : ''}`}
            onClick={() => setCurrentSection('overview')}
          >
            <span>📊</span>
            <span>Overview</span>
          </button>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navTitle}>Management</div>
          <button
            className={`${styles.navItem} ${currentSection === 'elections' ? styles.navItemActive : ''}`}
            onClick={() => setCurrentSection('elections')}
          >
            <span>🗳️</span>
            <span>Elections</span>
          </button>
          <button
            className={`${styles.navItem} ${currentSection === 'candidates' ? styles.navItemActive : ''}`}
            onClick={() => setCurrentSection('candidates')}
          >
            <span>👤</span>
            <span>Candidates</span>
          </button>
          <button
            className={`${styles.navItem} ${currentSection === 'voters' ? styles.navItemActive : ''}`}
            onClick={() => setCurrentSection('voters')}
          >
            <span>👥</span>
            <span>Voters</span>
          </button>
          <button
            className={`${styles.navItem} ${currentSection === 'votes' ? styles.navItemActive : ''}`}
            onClick={() => setCurrentSection('votes')}
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
          <div className={`${styles.alert} ${message.type === 'success' ? styles.alertSuccess : styles.alertWarning}`}>
            <span>{message.type === 'success' ? '✓' : '✗'}</span>
            <span>{message.text}</span>
          </div>
        )}

        {/* Overview */}
        {currentSection === 'overview' && (
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
                <div className={styles.statValue}>{votersData.length}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Votes</div>
                <div className={styles.statValue}>{votesData.length}</div>
              </div>
            </div>
          </div>
        )}

        {/* Elections */}
        {currentSection === 'elections' && (
          <div>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Election Management</h1>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={loadElections}
                disabled={loading}
              >
                {loading ? 'Loading...' : '🔄 Refresh'}
              </button>
            </div>

            {/* PERFECT CRUD BUTTONS */}
<div className={styles.sectionCard}>
  <h2 className={styles.sectionTitle}><span>⚡</span> Election Management</h2>
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
      onClick={() => setUpdateElectionId('')}
      disabled={loading}
    >
      ✏️ Update Election
    </button>
    <button 
      className={`${styles.btn} ${styles.crudDeleteBtn}`} 
      onClick={() => setDeleteElectionId('')}
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
                <h2 className={styles.sectionTitle}><span>🗳️</span> Elections List</h2>
                <div className={styles.dataTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Contract</th>
                      </tr>
                    </thead>
                    <tbody>
                      {elections.map((election, idx) => (
                        <tr key={idx}>
                          <td>{election.id || idx}</td>
                          <td>{election.title}</td>
                          <td>{election.type}</td>
                          <td><span className={`${styles.badge} ${styles.badgeSuccess}`}>{election.status || 'Active'}</span></td>
                          <td>{election.contractAddress?.slice(0, 10)}...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* UPDATE ELECTION */}
{updateElectionId !== '' && (
  <div className={styles.sectionCard}>
    <h3 className={styles.formTitle}>✏️ Update Election</h3>
    <input 
      type="text" 
      className={styles.updateIdInput}
      placeholder="Enter Election ID (e.g., 1)"
      value={updateElectionId}
      onChange={(e) => setUpdateElectionId(e.target.value)}
    />
    <div className={styles.crudBtnGroup}>
      <button 
        className={`${styles.btn} ${styles.crudUpdateBtn}`} 
        onClick={handleUpdateElection}
        disabled={loading || !updateElectionId.trim()}
      >
        Update Election
      </button>
    </div>
  </div>
)}

{/* DELETE ELECTION */}
{deleteElectionId !== '' && (
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
    </div>
  </div>
)}


            {/* Election Forms */}
            {showElectionForm && (
              <div className={styles.inputForm}>
                <h3 className={styles.formTitle}><span>➕</span> Create New Election</h3>
                <form onSubmit={handleCreateElection}>
                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Title *</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={electionForm.title}
                        onChange={(e) => setElectionForm({...electionForm, title: e.target.value})}
                        placeholder="Election title"
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Type *</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={electionForm.type}
                        onChange={(e) => setElectionForm({...electionForm, type: e.target.value})}
                        placeholder="Presidential, Local, etc."
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Start Date *</label>
                      <input
                        type="datetime-local"
                        className={styles.inputField}
                        value={electionForm.startDate}
                        onChange={(e) => setElectionForm({...electionForm, startDate: e.target.value})}
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>End Date *</label>
                      <input
                        type="datetime-local"
                        className={styles.inputField}
                        value={electionForm.endDate}
                        onChange={(e) => setElectionForm({...electionForm, endDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Description</label>
                    <textarea
                      className={styles.inputField}
                      value={electionForm.description}
                      onChange={(e) => setElectionForm({...electionForm, description: e.target.value})}
                      placeholder="Election description"
                    />
                  </div>
                  <div className={styles.btnGroup}>
                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
                      {loading ? 'Creating...' : 'Create Election'}
                    </button>
                    <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setShowElectionForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Candidates - Similar pattern */}
        {currentSection === 'candidates' && (
          <div>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Candidate Management</h1>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={loadCandidates}
                disabled={loading}
              >
                {loading ? 'Loading...' : '🔄 Refresh'}
              </button>
            </div>

           <div className={styles.sectionCard}>
  <h2 className={styles.sectionTitle}><span>⚡</span> Candidate Management</h2>
  <div className={styles.crudBtnGroup}>
    <button className={`${styles.btn} ${styles.crudCreateBtn}`} onClick={() => setShowCandidateForm(true)}>
      ➕ Create Candidate
    </button>
    <button className={`${styles.btn} ${styles.crudUpdateBtn}`} onClick={() => setUpdateCandidateId('')}>
      ✏️ Update Candidate
    </button>
    <button className={`${styles.btn} ${styles.crudDeleteBtn}`} onClick={() => setDeleteCandidateId('')}>
      🗑️ Delete Candidate
    </button>
    <button className={`${styles.btn} ${styles.crudRefreshBtn}`} onClick={loadCandidates}>
      🔄 Refresh
    </button>
  </div>
</div>


            {/* Candidates List */}
            {!loading && candidates.length > 0 && (
              <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}><span>👤</span> Candidates List</h2>
                <div className={styles.dataTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Party</th>
                        <th>Election</th>
                        <th>Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((candidate, idx) => (
                        <tr key={idx}>
                          <td>{candidate.id || idx}</td>
                          <td>{candidate.name}</td>
                          <td>{candidate.party}</td>
                          <td>{candidate.electionId}</td>
                          <td>{candidate.position}</td>
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
                <h3 className={styles.formTitle}><span>➕</span> Create New Candidate</h3>
                <form onSubmit={handleCreateCandidate}>
                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Name *</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={candidateForm.name}
                        onChange={(e) => setCandidateForm({...candidateForm, name: e.target.value})}
                        placeholder="Candidate full name"
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Party *</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={candidateForm.party}
                        onChange={(e) => setCandidateForm({...candidateForm, party: e.target.value})}
                        placeholder="Political party"
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Election ID *</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={candidateForm.electionId}
                        onChange={(e) => setCandidateForm({...candidateForm, electionId: e.target.value})}
                        placeholder="Election ID"
                        required
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Position</label>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={candidateForm.position}
                        onChange={(e) => setCandidateForm({...candidateForm, position: e.target.value})}
                        placeholder="President, VP, etc."
                      />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Bio</label>
                    <textarea
                      className={styles.inputField}
                      value={candidateForm.bio}
                      onChange={(e) => setCandidateForm({...candidateForm, bio: e.target.value})}
                      placeholder="Candidate biography"
                    />
                  </div>
                  <div className={styles.btnGroup}>
                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
                      {loading ? 'Creating...' : 'Create Candidate'}
                    </button>
                    <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setShowCandidateForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Voters */}
        {currentSection === 'voters' && (
          <div>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Voter Management</h1>
            </div>

            <div className={styles.inputForm}>
              <h3 className={styles.formTitle}><span>👥</span> Voter Actions</h3>
              
              {/* Get All Voters */}
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Page</label>
                  <input
                    type="number"
                    className={styles.inputField}
                    value={currentPage}
                    onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Size</label>
                  <input
                    type="number"
                    className={styles.inputField}
                    value={votersPageSize}
                    onChange={(e) => setVotersPageSize(parseInt(e.target.value) || 10)}
                    min="1"
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
              <div style={{marginTop: '20px'}}>
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
                <h2 className={styles.sectionTitle}><span>📋</span> Voters Data</h2>
                <div className={styles.dataTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {votersData.map((voter, idx) => (
                        <tr key={idx}>
                          <td>{voter.id}</td>
                          <td>{voter.name}</td>
                          <td>{voter.email}</td>
                          <td>
                            <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                              {voter.status || 'Active'}
                            </span>
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
        {currentSection === 'votes' && (
          <div>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Vote Results</h1>
            </div>

            <div className={styles.inputForm}>
              <h3 className={styles.formTitle}><span>📈</span> Vote Analytics</h3>
              
              {/* Get All Votes */}
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Contract Address</label>
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="0x..."
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                  />
                </div>
                <button 
                  className={`${styles.btn} ${styles.btnPrimary}`} 
                  onClick={handleGetAllVotes}
                  disabled={loading || !contractAddress.trim()}
                >
                  📊 Get All Votes
                </button>
              </div>

              {/* Get Single Candidate Votes */}
              <div style={{marginTop: '20px'}}>
                <div className={styles.formRow}>
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Contract Address"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
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
                    disabled={loading || !contractAddress.trim() || !candidateIdForVotes.trim()}
                  >
                    📈 Candidate Votes
                  </button>
                </div>
              </div>
            </div>

            {/* Votes Table */}
            {votesData.length > 0 && (
              <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}><span>📊</span> Vote Results</h2>
                <div className={styles.dataTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>Candidate ID</th>
                        <th>Votes Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {votesData.map((vote, idx) => (
                        <tr key={idx}>
                          <td>{vote.candidateId || idx}</td>
                          <td>{vote.voteCount || 0}</td>
                          <td>{((vote.voteCount || 0) / votesData.reduce((sum, v) => sum + (v.voteCount || 0), 0) * 100).toFixed(1)}%</td>
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

      {sidebarOpen && <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default Admin;
