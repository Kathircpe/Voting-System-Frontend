import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './voter.module.css';

const VoterDashboard = () => {
  const [currentSection, setCurrentSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { 
      name: 'Guest', 
      // id: 'N/A',
      email: 'N/A' 
    };
  });

  // Stats State
  const [stats, setStats] = useState({
    activeElections: 3,
    votesCast: 2,
    pendingElections: 1,
    accountStatus: 'Active'
  });

  // Profile State
  const [voterDetails, setVoterDetails] = useState(null);

  // Candidates State
  const [candidates, setCandidates] = useState([]);

  // Vote Form State
  const [voteForm, setVoteForm] = useState({
    contractAddress: '',
    candidateId: '',
    confirmCandidateId: ''
  });
  const [voteMessage, setVoteMessage] = useState(null);

  // Results State
  const [results, setResults] = useState([]);
  const [resultsContract, setResultsContract] = useState('');

  // Update Profile State
  const [updateForm, setUpdateForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    address: ''
  });
  const [updateMessage, setUpdateMessage] = useState(null);

  // API Configuration
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1/voter';
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });

  // API Functions
  const apiCalls = {
    getVoterDetails: async (voterId) => {
      const response = await api.get(`/voters/${voterId}`);
      return response.data;
    },
    getAllCandidates: async () => {
      const response = await api.get('/candidates');
      return response.data;
    },
    castVote: async (data) => {
      const response = await api.post('/votes/vote', data);
      return response.data;
    },
    getVoteResults: async (contractAddress) => {
      const response = await api.get(`/votes/${contractAddress}`);
      return response.data;
    },
    updateVoter: async (voterId, data) => {
      const response = await api.put(`/voters/${voterId}`, data);
      return response.data;
    }
  };

  // Load candidates on mount
  useEffect(() => {
    if (currentSection === 'candidates') {
      loadCandidates();
    }
  }, [currentSection]);

  // Handlers
  const handleGetVoterDetails = async (voterId) => {
    if (!voterId.trim()) {
      alert('Please enter your Voter ID');
      return;
    }

    try {
      setLoading(true);
      const data = await apiCalls.getVoterDetails(voterId);
      setVoterDetails(data);
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || 'Failed to fetch voter details'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const data = await apiCalls.getAllCandidates();
      setCandidates(data.content || data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCastVote = async (e) => {
    e.preventDefault();

    if (!voteForm.contractAddress || !voteForm.candidateId || !voteForm.confirmCandidateId) {
      alert('Please fill in all fields');
      return;
    }

    if (voteForm.confirmCandidateId !== voteForm.candidateId) {
      alert('Confirmation does not match selected candidate ID');
      return;
    }

    if (!window.confirm(`Are you sure you want to vote for candidate ${voteForm.candidateId}? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      await apiCalls.castVote({
        contractAddress: voteForm.contractAddress,
        candidateId: voteForm.candidateId,
        voterId: user.voterId
      });
      setVoteMessage({ type: 'success', text: 'Your vote has been successfully recorded! Thank you for participating.' });
      setVoteForm({ contractAddress: '', candidateId: '', confirmCandidateId: '' });
      setTimeout(() => setVoteMessage(null), 7000);
    } catch (error) {
      setVoteMessage({ type: 'error', text: error.response?.data?.message || 'Failed to cast vote. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGetResults = async () => {
    if (!resultsContract.trim()) {
      alert('Please enter contract address');
      return;
    }

    try {
      setLoading(true);
      const data = await apiCalls.getVoteResults(resultsContract);
      setResults(data);
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || 'Failed to fetch vote results'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const { name, email, phone, age, address } = updateForm;

    if (!name || !email || !phone || !age || !address) {
      alert('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    if (age < 18) {
      alert('You must be at least 18 years old');
      return;
    }

    try {
      setLoading(true);
      await apiCalls.updateVoter(user.voterId, updateForm);
      setUpdateMessage({ type: 'success', text: 'Profile updated successfully! Changes will be reflected shortly.' });
      setTimeout(() => setUpdateMessage(null), 5000);
    } catch (error) {
      setUpdateMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.layout}>
      {/* Mobile Toggle */}
      <button 
        className={styles.mobileToggle}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🗳️</span>
          <span>VotePortal</span>
        </div>

        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>👤</div>
          <div className={styles.userName}>{user.name}</div>
          <div className={styles.userId}>Voter ID: {user.voterId}</div>
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
          <div className={styles.navTitle}>Actions</div>
          <button
            className={`${styles.navItem} ${currentSection === 'profile' ? styles.navItemActive : ''}`}
            onClick={() => setCurrentSection('profile')}
          >
            <span>👤</span>
            <span>My Profile</span>
          </button>
          <button
            className={`${styles.navItem} ${currentSection === 'candidates' ? styles.navItemActive : ''}`}
            onClick={() => setCurrentSection('candidates')}
          >
            <span>👥</span>
            <span>View Candidates</span>
          </button>
          <button
            className={`${styles.navItem} ${currentSection === 'vote' ? styles.navItemActive : ''}`}
            onClick={() => setCurrentSection('vote')}
          >
            <span>🗳️</span>
            <span>Cast Vote</span>
          </button>
          <button
            className={`${styles.navItem} ${currentSection === 'results' ? styles.navItemActive : ''}`}
            onClick={() => setCurrentSection('results')}
          >
            <span>📈</span>
            <span>Vote Results</span>
          </button>
          <button
            className={`${styles.navItem} ${currentSection === 'update' ? styles.navItemActive : ''}`}
            onClick={() => setCurrentSection('update')}
          >
            <span>✏️</span>
            <span>Update Profile</span>
          </button>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navTitle}>Account</div>
          <button className={styles.navItem}>
            <span>⚙️</span>
            <span>Settings</span>
          </button>
          <button 
            className={styles.navItem} 
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Overview Section */}
        {currentSection === 'overview' && (
          <div>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>Welcome Back, {user.name}!</h1>
                <p className={styles.pageSubtitle}>Your voting dashboard is ready</p>
              </div>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => setCurrentSection('vote')}
              >
                🗳️ Quick Vote
              </button>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Active Elections</div>
                <div className={styles.statValue}>{stats.activeElections}</div>
                <div className={`${styles.statTrend} ${styles.statTrendPositive}`}>↗ 1 new this week</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Votes Cast</div>
                <div className={styles.statValue}>{stats.votesCast}</div>
                <div className={`${styles.statTrend} ${styles.statTrendPositive}`}>✓ Verified</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Pending Elections</div>
                <div className={styles.statValue}>{stats.pendingElections}</div>
                <div className={`${styles.statTrend} ${styles.statTrendWarning}`}>⏰ Ends in 2 days</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Account Status</div>
                <div className={styles.statValue}>
                  <span className={`${styles.badge} ${styles.badgeSuccess}`}>{stats.accountStatus}</span>
                </div>
                <div className={`${styles.statTrend} ${styles.statTrendPositive}`}>✓ Verified Voter</div>
              </div>
            </div>

            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <span>⚡</span>
                Quick Actions
              </h2>

              <div className={styles.actionGrid}>
                <div className={styles.actionCard} onClick={() => setCurrentSection('profile')}>
                  <div className={styles.actionIcon}>👤</div>
                  <div>
                    <div className={styles.actionTitle}>View Profile</div>
                    <div className={styles.actionDescription}>See your voter details</div>
                  </div>
                </div>
                <div className={styles.actionCard} onClick={() => setCurrentSection('candidates')}>
                  <div className={styles.actionIcon}>👥</div>
                  <div>
                    <div className={styles.actionTitle}>View Candidates</div>
                    <div className={styles.actionDescription}>Browse all candidates</div>
                  </div>
                </div>
                <div className={styles.actionCard} onClick={() => setCurrentSection('vote')}>
                  <div className={styles.actionIcon}>🗳️</div>
                  <div>
                    <div className={styles.actionTitle}>Cast Vote</div>
                    <div className={styles.actionDescription}>Participate in elections</div>
                  </div>
                </div>
                <div className={styles.actionCard} onClick={() => setCurrentSection('results')}>
                  <div className={styles.actionIcon}>📈</div>
                  <div>
                    <div className={styles.actionTitle}>View Results</div>
                    <div className={styles.actionDescription}>Check vote counts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Section */}
        {currentSection === 'profile' && (
          <div>
            <h1 className={styles.pageTitle}>My Profile</h1>
            <p className={styles.pageSubtitle}>View your voter details</p>

            <div className={styles.inputForm}>
              <h3 className={styles.formTitle}>
                <span>👤</span>
                Voter Details
              </h3>

              <input
                type="text"
                className={styles.inputField}
                placeholder="Enter your Voter ID"
                defaultValue={user.voterId}
                onBlur={(e) => handleGetVoterDetails(e.target.value)}
              />

              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => handleGetVoterDetails(user.voterId)}
                disabled={loading}
              >
                {loading ? 'Loading...' : '🔍 Get My Details'}
              </button>
            </div>

            {voterDetails && (
              <div className={styles.infoCard}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Voter ID</span>
                  <span className={styles.infoValue}>{voterDetails.voterId}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Full Name</span>
                  <span className={styles.infoValue}>{voterDetails.name}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>{voterDetails.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Phone</span>
                  <span className={styles.infoValue}>{voterDetails.phone}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Age</span>
                  <span className={styles.infoValue}>{voterDetails.age} years</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Address</span>
                  <span className={styles.infoValue}>{voterDetails.address}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Status</span>
                  <span className={`${styles.badge} ${styles.badgeSuccess}`}>{voterDetails.status}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Registered Date</span>
                  <span className={styles.infoValue}>
                    {new Date(voterDetails.registeredDate).toLocaleDateString()}
                  </span>
                </div>
                <div className={`${styles.infoRow} ${styles.infoRowLast}`}>
                  <span className={styles.infoLabel}>Votes Cast</span>
                  <span className={styles.infoValue}>{voterDetails.votesCast}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Candidates Section */}
        {currentSection === 'candidates' && (
          <div>
            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>Candidates</h1>
                <p className={styles.pageSubtitle}>View all registered candidates</p>
              </div>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={loadCandidates}
                disabled={loading}
              >
                {loading ? 'Loading...' : '🔄 Refresh List'}
              </button>
            </div>

            {loading ? (
              <div className={styles.loadingText}>Loading candidates...</div>
            ) : (
              <div className={styles.candidatesGrid}>
                {candidates.map((candidate, idx) => (
                  <div key={idx} className={styles.candidateCard}>
                    <div className={styles.candidateHeader}>
                      <div className={styles.candidateAvatar}>
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <div className={styles.candidateName}>{candidate.name}</div>
                        <div className={styles.candidateParty}>{candidate.party}</div>
                      </div>
                    </div>
                    <div className={styles.candidateBody}>
                      <div className={styles.candidateBadges}>
                        <span className={`${styles.badge} ${styles.badgePrimary}`}>
                          {candidate.position}
                        </span>
                        <span className={`${styles.badge} ${styles.badgeInfo}`}>
                          ID: {candidate.candidateId}
                        </span>
                      </div>
                      <div className={styles.candidateBio}>{candidate.bio}</div>
                      {candidate.votes !== undefined && (
                        <div className={styles.candidateVotes}>
                          <span>Current Votes:</span>
                          <span className={styles.voteCount}>{candidate.votes.toLocaleString()}</span>
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
        {currentSection === 'vote' && (
          <div>
            <h1 className={styles.pageTitle}>Cast Your Vote</h1>
            <p className={styles.pageSubtitle}>Make your voice heard</p>

            <div className={styles.inputForm}>
              <h3 className={styles.formTitle}>
                <span>🗳️</span>
                Vote Now
              </h3>

              <div className={`${styles.alert} ${styles.alertInfo}`}>
                <span>ℹ️</span>
                <span>Your vote is anonymous and cannot be changed once submitted.</span>
              </div>

              <form onSubmit={handleCastVote}>
                <label className={styles.label}>Contract Address *</label>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Enter election contract address"
                  value={voteForm.contractAddress}
                  onChange={(e) => setVoteForm({ ...voteForm, contractAddress: e.target.value })}
                  required
                />

                <label className={styles.label}>Select Candidate *</label>
                <select
                  className={styles.inputField}
                  value={voteForm.candidateId}
                  onChange={(e) => setVoteForm({ ...voteForm, candidateId: e.target.value })}
                  required
                >
                  <option value="">Choose a candidate...</option>
                  {candidates.map((c) => (
                    <option key={c.candidateId} value={c.candidateId}>
                      {c.name} - {c.party}
                    </option>
                  ))}
                </select>

                <label className={styles.label}>Confirm Your Choice *</label>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Type candidate ID to confirm"
                  value={voteForm.confirmCandidateId}
                  onChange={(e) => setVoteForm({ ...voteForm, confirmCandidateId: e.target.value })}
                  required
                />
                {voteForm.candidateId && (
                  <small className={styles.helpText}>Please type: {voteForm.candidateId}</small>
                )}

                <div className={styles.btnGroup}>
                  <button type="submit" className={`${styles.btn} ${styles.btnSuccess}`} disabled={loading}>
                    {loading ? 'Submitting...' : '✓ Submit Vote'}
                  </button>
                  <button 
                    type="button" 
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => setVoteForm({ contractAddress: '', candidateId: '', confirmCandidateId: '' })}
                  >
                    ✗ Cancel
                  </button>
                </div>
              </form>

              {voteMessage && (
                <div className={`${styles.alert} ${voteMessage.type === 'success' ? styles.alertSuccess : styles.alertWarning}`}>
                  <span>{voteMessage.type === 'success' ? '✓' : '✗'}</span>
                  <span>{voteMessage.text}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Section */}
        {currentSection === 'results' && (
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
                placeholder="Enter election contract address"
                value={resultsContract}
                onChange={(e) => setResultsContract(e.target.value)}
              />

              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleGetResults}
                disabled={loading}
              >
                {loading ? 'Loading...' : '📊 Get Results'}
              </button>
            </div>

            {results.length > 0 && (
              <>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Candidate</th>
                        <th>Party</th>
                        <th>Votes</th>
                        <th>Percentage</th>
                        <th>Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => {
                        const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);
                        const percentage = ((result.votes / totalVotes) * 100).toFixed(1);
                        return (
                          <tr key={index}>
                            <td><strong>#{index + 1}</strong></td>
                            <td><strong>{result.name}</strong></td>
                            <td>{result.party}</td>
                            <td><strong className={styles.voteCount}>{result.votes.toLocaleString()}</strong></td>
                            <td>
                              <span className={`${styles.badge} ${styles.badgeInfo}`}>{percentage}%</span>
                            </td>
                            <td>
                              <div className={styles.progressBar}>
                                <div 
                                  className={styles.progressFill} 
                                  style={{width: `${percentage}%`}}
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
                    <span className={styles.infoLabel}>Total Votes Cast</span>
                    <span className={`${styles.infoValue} ${styles.infoValueLarge}`}>
                      {results.reduce((sum, r) => sum + r.votes, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Leading Candidate</span>
                    <span className={styles.infoValue}>
                      {results[0].name} ({results[0].party})
                    </span>
                  </div>
                  <div className={`${styles.infoRow} ${styles.infoRowLast}`}>
                    <span className={styles.infoLabel}>Election Status</span>
                    <span className={`${styles.badge} ${styles.badgeSuccess}`}>In Progress</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Update Profile Section */}
        {currentSection === 'update' && (
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
                <span>Please ensure all information is accurate. Changes may require re-verification.</span>
              </div>

              <form onSubmit={handleUpdateProfile}>
                <label className={styles.label}>Voter ID (Cannot be changed)</label>
                <input
                  type="text"
                  className={`${styles.inputField} ${styles.inputFieldDisabled}`}
                  value={user.voterId}
                  disabled
                />

                <div className={styles.formRow}>
                  <div>
                    <label className={styles.label}>Full Name *</label>
                    <input
                      type="text"
                      className={styles.inputField}
                      placeholder="John Doe"
                      value={updateForm.name}
                      onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className={styles.label}>Email *</label>
                    <input
                      type="email"
                      className={styles.inputField}
                      placeholder="john@example.com"
                      value={updateForm.email}
                      onChange={(e) => setUpdateForm({ ...updateForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div>
                    <label className={styles.label}>Phone Number *</label>
                    <input
                      type="tel"
                      className={styles.inputField}
                      placeholder="1234567890"
                      maxLength="10"
                      value={updateForm.phone}
                      onChange={(e) => setUpdateForm({ ...updateForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className={styles.label}>Age *</label>
                    <input
                      type="number"
                      className={styles.inputField}
                      placeholder="25"
                      min="18"
                      value={updateForm.age}
                      onChange={(e) => setUpdateForm({ ...updateForm, age: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <label className={styles.label}>Address *</label>
                <textarea
                  className={`${styles.inputField} ${styles.textArea}`}
                  placeholder="Enter your full address..."
                  value={updateForm.address}
                  onChange={(e) => setUpdateForm({ ...updateForm, address: e.target.value })}
                  required
                />

                <div className={styles.btnGroup}>
                  <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
                    {loading ? 'Saving...' : '💾 Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => setUpdateForm({ name: '', email: '', phone: '', age: '', address: '' })}
                  >
                    ↻ Reset
                  </button>
                </div>
              </form>

              {updateMessage && (
                <div className={`${styles.alert} ${updateMessage.type === 'success' ? styles.alertSuccess : styles.alertWarning}`}>
                  <span>{updateMessage.type === 'success' ? '✓' : '✗'}</span>
                  <span>{updateMessage.text}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default VoterDashboard;
