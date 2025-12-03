import React, { useState } from 'react';
import styles from './admin.module.css';

const Admin = () => {
  if(!localStorage.token||localStorage.user.id!=1){
    window.location.href='/login';
  }
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenuSection, setOpenMenuSection] = useState('main');
  const [electionFormType, setElectionFormType] = useState(null);
  const [candidateFormType, setCandidateFormType] = useState(null);
  const [votersFormType, setVotersFormType] = useState(null);
  const [votesFormType, setVotesFormType] = useState(null);
  const [votersData, setVotersData] = useState([]);
  const [votesData, setVotesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [electionForm, setElectionForm] = useState({
    title: '',
    type: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const [candidateForm, setCandidateForm] = useState({
    name: '',
    party: '',
    electionId: '',
    position: '',
    bio: ''
  });

  const [votersPageSize, setVotersPageSize] = useState(10);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMenuSection = (section) => {
    setOpenMenuSection(openMenuSection === section ? null : section);
  };

  const showSection = (section) => {
    setActiveSection(section);
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  };

  // All handler functions remain the same...
  const createElection = async () => {
    if (!electionForm.title || !electionForm.type || !electionForm.startDate || !electionForm.endDate) {
      alert('Please fill all required fields');
      return;
    }
    console.log('Creating election:', electionForm);
    alert('Election created successfully!');
    setElectionFormType(null);
    setElectionForm({ title: '', type: '', startDate: '', endDate: '', description: '' });
  };

  const updateElection = async (id) => {
    if (!id) {
      alert('Please enter Election ID');
      return;
    }
    console.log('Updating election:', { id, ...electionForm });
    alert(`Election ${id} updated successfully!`);
    setElectionFormType(null);
  };

  const deleteElection = async (id) => {
    if (!id) {
      alert('Please enter Election ID');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete election ${id}?`)) {
      return;
    }
    console.log('Deleting election:', id);
    alert(`Election ${id} deleted successfully!`);
    setElectionFormType(null);
  };

  const createCandidate = async () => {
    if (!candidateForm.name || !candidateForm.party) {
      alert('Please fill all required fields');
      return;
    }
    console.log('Creating candidate:', candidateForm);
    alert('Candidate registered successfully!');
    setCandidateFormType(null);
    setCandidateForm({ name: '', party: '', electionId: '', position: '', bio: '' });
  };

  const updateCandidate = async (id) => {
    if (!id) {
      alert('Please enter Candidate ID');
      return;
    }
    console.log('Updating candidate:', { id, ...candidateForm });
    alert(`Candidate ${id} updated successfully!`);
    setCandidateFormType(null);
  };

  const deleteCandidate = async (id) => {
    if (!id) {
      alert('Please enter Candidate ID');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete candidate ${id}?`)) {
      return;
    }
    console.log('Deleting candidate:', id);
    alert(`Candidate ${id} deleted successfully!`);
    setCandidateFormType(null);
  };

  const getAllVoters = async () => {
    console.log('Fetching voters:', { page: currentPage, size: votersPageSize });
    const mockVoters = [
      { id: 'V001', name: 'Alice Johnson', email: 'alice@example.com', age: 32, status: 'Active' },
      { id: 'V002', name: 'Bob Smith', email: 'bob@example.com', age: 45, status: 'Active' },
      { id: 'V003', name: 'Carol Williams', email: 'carol@example.com', age: 28, status: 'Pending' },
    ];
    setVotersData(mockVoters);
  };

  const getSingleVoter = async (id) => {
    if (!id) {
      alert('Please enter Voter ID');
      return;
    }
    console.log('Fetching voter:', id);
    const mockVoter = [
      { id: id, name: 'John Doe', email: 'john@example.com', age: 35, status: 'Active' }
    ];
    setVotersData(mockVoter);
  };

  const getAllVotes = async (contractAddress) => {
    if (!contractAddress) {
      alert('Please enter contract address');
      return;
    }
    console.log('Fetching all votes:', { contractAddress });
    const mockVotes = [
      { candidateId: 'C001', name: 'Alice Johnson', party: 'Democratic', votes: 1234 },
      { candidateId: 'C002', name: 'Bob Smith', party: 'Republican', votes: 987 },
      { candidateId: 'C003', name: 'Carol Williams', party: 'Independent', votes: 456 },
    ];
    setVotesData(mockVotes);
  };

  const getSingleVotes = async (contractAddress, candidateId) => {
    if (!contractAddress || !candidateId) {
      alert('Please fill all fields');
      return;
    }
    console.log('Fetching single candidate votes:', { contractAddress, candidateId });
    const mockVotes = [
      { candidateId: candidateId, name: 'John Candidate', party: 'Democratic', votes: 1567 },
    ];
    setVotesData(mockVotes);
  };

  return (
    <div className={styles.adminLayout}>
      {/* Mobile Menu Toggle */}
      <button className={styles.mobileMenuToggle} onClick={toggleSidebar}>
        <span>☰</span>
      </button>

      {/* Sidebar with Collapsible Sections */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.active : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>⚡</div>
            <span>Admin</span>
          </div>
        </div>

        {/* Main Section */}
        <nav className={styles.navSection}>
          <div 
            className={`${styles.navTitle} ${styles.collapsible}`}
            onClick={() => toggleMenuSection('main')}
          >
            Main
            <span className={`${styles.arrow} ${openMenuSection === 'main' ? styles.open : ''}`}>▼</span>
          </div>
          <div className={`${styles.navItems} ${openMenuSection === 'main' ? styles.expanded : styles.collapsed}`}>
            <a 
              href="#overview" 
              className={`${styles.navItem} ${activeSection === 'overview' ? styles.active : ''}`}
              onClick={(e) => { e.preventDefault(); showSection('overview'); }}
            >
              <span className={styles.navIcon}>📊</span>
              <span>Overview</span>
            </a>
          </div>
        </nav>

        {/* Management Section */}
        <nav className={styles.navSection}>
          <div 
            className={`${styles.navTitle} ${styles.collapsible}`}
            onClick={() => toggleMenuSection('management')}
          >
            Management
            <span className={`${styles.arrow} ${openMenuSection === 'management' ? styles.open : ''}`}>▼</span>
          </div>
          <div className={`${styles.navItems} ${openMenuSection === 'management' ? styles.expanded : styles.collapsed}`}>
            <a 
              href="#elections" 
              className={`${styles.navItem} ${activeSection === 'elections' ? styles.active : ''}`}
              onClick={(e) => { e.preventDefault(); showSection('elections'); }}
            >
              <span className={styles.navIcon}>🗳️</span>
              <span>Elections</span>
            </a>
            <a 
              href="#candidates" 
              className={`${styles.navItem} ${activeSection === 'candidates' ? styles.active : ''}`}
              onClick={(e) => { e.preventDefault(); showSection('candidates'); }}
            >
              <span className={styles.navIcon}>👤</span>
              <span>Candidates</span>
            </a>
            <a 
              href="#voters" 
              className={`${styles.navItem} ${activeSection === 'voters' ? styles.active : ''}`}
              onClick={(e) => { e.preventDefault(); showSection('voters'); }}
            >
              <span className={styles.navIcon}>👥</span>
              <span>Voters</span>
            </a>
            <a 
              href="#votes" 
              className={`${styles.navItem} ${activeSection === 'votes' ? styles.active : ''}`}
              onClick={(e) => { e.preventDefault(); showSection('votes'); }}
            >
              <span className={styles.navIcon}>📈</span>
              <span>Vote Results</span>
            </a>
          </div>
        </nav>

        {/* Account Section */}
        <nav className={styles.navSection}>
          <div 
            className={`${styles.navTitle} ${styles.collapsible}`}
            onClick={() => toggleMenuSection('account')}
          >
            Account
            <span className={`${styles.arrow} ${openMenuSection === 'account' ? styles.open : ''}`}>▼</span>
          </div>
          <div className={`${styles.navItems} ${openMenuSection === 'account' ? styles.expanded : styles.collapsed}`}>
            <a href="#settings" className={styles.navItem}>
              <span className={styles.navIcon}>⚙️</span>
              <span>Settings</span>
            </a>
            <a href="/login" className={styles.navItem}>
              <span className={styles.navIcon}>🚪</span>
              <span>Logout</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {activeSection === 'overview' && (
          <div className={styles.contentSection}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Dashboard Overview</h1>
              <p className={styles.pageSubtitle}>Welcome back, Admin. Here's what's happening today.</p>
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Elections</div>
                <div className={styles.statValue}>12</div>
                <div className={styles.statTrend}>↗ +2 this month</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Candidates</div>
                <div className={styles.statValue}>48</div>
                <div className={styles.statTrend}>↗ +8 this month</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Registered Voters</div>
                <div className={styles.statValue}>1,234</div>
                <div className={styles.statTrend}>↗ +156 this month</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Votes Cast</div>
                <div className={styles.statValue}>987</div>
                <div className={styles.statTrend}>↗ +87 today</div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'elections' && (
          <ElectionsSection 
            formType={electionFormType}
            setFormType={setElectionFormType}
            formData={electionForm}
            setFormData={setElectionForm}
            onCreate={createElection}
            onUpdate={updateElection}
            onDelete={deleteElection}
          />
        )}

        {activeSection === 'candidates' && (
          <CandidatesSection 
            formType={candidateFormType}
            setFormType={setCandidateFormType}
            formData={candidateForm}
            setFormData={setCandidateForm}
            onCreate={createCandidate}
            onUpdate={updateCandidate}
            onDelete={deleteCandidate}
          />
        )}

        {activeSection === 'voters' && (
          <VotersSection 
            formType={votersFormType}
            setFormType={setVotersFormType}
            votersData={votersData}
            setVotersData={setVotersData}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={votersPageSize}
            setPageSize={setVotersPageSize}
            onGetAll={getAllVoters}
            onGetSingle={getSingleVoter}
          />
        )}

        {activeSection === 'votes' && (
          <VotesSection 
            formType={votesFormType}
            setFormType={setVotesFormType}
            votesData={votesData}
            setVotesData={setVotesData}
            onGetAll={getAllVotes}
            onGetSingle={getSingleVotes}
          />
        )}
      </main>
    </div>
  );
};

// Elections Section Component
const ElectionsSection = ({ formType, setFormType, formData, setFormData, onCreate, onUpdate, onDelete }) => {
  const [updateId, setUpdateId] = useState('');
  const [deleteId, setDeleteId] = useState('');

  return (
    <div className={styles.contentSection}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Election Management</h1>
        <p className={styles.pageSubtitle}>Create, update, and manage elections</p>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🗳️</span>
            Elections
          </h2>
        </div>

        <div className={styles.actionGrid}>
          <div className={styles.actionCard} onClick={() => setFormType('create')}>
            <div className={styles.actionCardHeader}>
              <div className={`${styles.actionIcon} ${styles.create}`}>➕</div>
              <div>
                <div className={styles.actionTitle}>Create Election</div>
                <div className={styles.actionDescription}>Add a new election to the system</div>
              </div>
            </div>
          </div>

          <div className={styles.actionCard} onClick={() => setFormType('update')}>
            <div className={styles.actionCardHeader}>
              <div className={`${styles.actionIcon} ${styles.update}`}>✏️</div>
              <div>
                <div className={styles.actionTitle}>Update Election</div>
                <div className={styles.actionDescription}>Modify election details by ID</div>
              </div>
            </div>
          </div>

          <div className={styles.actionCard} onClick={() => setFormType('delete')}>
            <div className={styles.actionCardHeader}>
              <div className={`${styles.actionIcon} ${styles.delete}`}>🗑️</div>
              <div>
                <div className={styles.actionTitle}>Delete Election</div>
                <div className={styles.actionDescription}>Remove election from system</div>
              </div>
            </div>
          </div>
        </div>

        {formType === 'create' && (
          <div className={styles.inputForm}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Create New Election</h3>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Election Title</label>
                <input 
                  type="text" 
                  className={styles.inputField}
                  placeholder="Presidential Election 2025"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Election Type</label>
                <input 
                  type="text" 
                  className={styles.inputField}
                  placeholder="General/Local/Special"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Start Date</label>
                <input 
                  type="date" 
                  className={styles.inputField}
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>End Date</label>
                <input 
                  type="date" 
                  className={styles.inputField}
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Description</label>
              <textarea 
                className={styles.inputField}
                placeholder="Election description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className={styles.btnGroup}>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onCreate}>
                <span>✓</span> Create Election
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setFormType(null)}>
                <span>✗</span> Cancel
              </button>
            </div>
          </div>
        )}

        {formType === 'update' && (
          <div className={styles.inputForm}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Update Election</h3>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Election ID</label>
              <input 
                type="text" 
                className={styles.inputField}
                placeholder="Enter Election ID"
                value={updateId}
                onChange={(e) => setUpdateId(e.target.value)}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>New Title</label>
                <input 
                  type="text" 
                  className={styles.inputField}
                  placeholder="Updated title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>New Type</label>
                <input 
                  type="text" 
                  className={styles.inputField}
                  placeholder="Updated type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>New Start Date</label>
                <input 
                  type="date" 
                  className={styles.inputField}
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>New End Date</label>
                <input 
                  type="date" 
                  className={styles.inputField}
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.btnGroup}>
              <button className={`${styles.btn} ${styles.btnInfo}`} onClick={() => onUpdate(updateId)}>
                <span>↻</span> Update Election
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setFormType(null)}>
                <span>✗</span> Cancel
              </button>
            </div>
          </div>
        )}

        {formType === 'delete' && (
          <div className={styles.inputForm}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Delete Election</h3>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Election ID</label>
              <input 
                type="text" 
                className={styles.inputField}
                placeholder="Enter Election ID to delete"
                value={deleteId}
                onChange={(e) => setDeleteId(e.target.value)}
              />
            </div>
            <div className={styles.btnGroup}>
              <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => onDelete(deleteId)}>
                <span>🗑️</span> Delete Election
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setFormType(null)}>
                <span>✗</span> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Candidates Section Component
const CandidatesSection = ({ formType, setFormType, formData, setFormData, onCreate, onUpdate, onDelete }) => {
  const [updateId, setUpdateId] = useState('');
  const [deleteId, setDeleteId] = useState('');

  return (
    <div className={styles.contentSection}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Candidate Management</h1>
        <p className={styles.pageSubtitle}>Manage candidate profiles and information</p>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>👤</span>
            Candidates
          </h2>
        </div>

        <div className={styles.actionGrid}>
          <div className={styles.actionCard} onClick={() => setFormType('create')}>
            <div className={styles.actionCardHeader}>
              <div className={`${styles.actionIcon} ${styles.create}`}>➕</div>
              <div>
                <div className={styles.actionTitle}>Create Candidate</div>
                <div className={styles.actionDescription}>Register new candidate</div>
              </div>
            </div>
          </div>

          <div className={styles.actionCard} onClick={() => setFormType('update')}>
            <div className={styles.actionCardHeader}>
              <div className={`${styles.actionIcon} ${styles.update}`}>✏️</div>
              <div>
                <div className={styles.actionTitle}>Update Candidate</div>
                <div className={styles.actionDescription}>Edit candidate details by ID</div>
              </div>
            </div>
          </div>

          <div className={styles.actionCard} onClick={() => setFormType('delete')}>
            <div className={styles.actionCardHeader}>
              <div className={`${styles.actionIcon} ${styles.delete}`}>🗑️</div>
              <div>
                <div className={styles.actionTitle}>Delete Candidate</div>
                <div className={styles.actionDescription}>Remove candidate by ID</div>
              </div>
            </div>
          </div>
        </div>

        {formType === 'create' && (
          <div className={styles.inputForm}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Register New Candidate</h3>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Full Name</label>
                <input 
                  type="text" 
                  className={styles.inputField}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Party</label>
                <input 
                  type="text" 
                  className={styles.inputField}
                  placeholder="Democratic Party"
                  value={formData.party}
                  onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Election ID</label>
                <input 
                  type="text" 
                  className={styles.inputField}
                  placeholder="Election ID"
                  value={formData.electionId}
                  onChange={(e) => setFormData({ ...formData, electionId: e.target.value })}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Position</label>
                <input 
                  type="text" 
                  className={styles.inputField}
                  placeholder="President/Senator"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Bio</label>
              <textarea 
                className={styles.inputField}
                placeholder="Candidate biography..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
            <div className={styles.btnGroup}>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onCreate}>
                <span>✓</span> Register Candidate
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setFormType(null)}>
                <span>✗</span> Cancel
              </button>
            </div>
          </div>
        )}

        {formType === 'update' && (
          <div className={styles.inputForm}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Update Candidate</h3>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Candidate ID</label>
              <input 
                type="text" 
                className={styles.inputField}
                placeholder="Enter Candidate ID"
                value={updateId}
                onChange={(e) => setUpdateId(e.target.value)}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>New Name</label>
                <input 
                  type="text" 
                  className={styles.inputField}
                  placeholder="Updated name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>New Party</label>
                <input 
                  type="text" 
                  className={styles.inputField}
                  placeholder="Updated party"
                  value={formData.party}
                  onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.btnGroup}>
              <button className={`${styles.btn} ${styles.btnInfo}`} onClick={() => onUpdate(updateId)}>
                <span>↻</span> Update Candidate
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setFormType(null)}>
                <span>✗</span> Cancel
              </button>
            </div>
          </div>
        )}

        {formType === 'delete' && (
          <div className={styles.inputForm}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Delete Candidate</h3>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Candidate ID</label>
              <input 
                type="text" 
                className={styles.inputField}
                placeholder="Enter Candidate ID"
                value={deleteId}
                onChange={(e) => setDeleteId(e.target.value)}
              />
            </div>
            <div className={styles.btnGroup}>
              <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => onDelete(deleteId)}>
                <span>🗑️</span> Delete Candidate
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setFormType(null)}>
                <span>✗</span> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Voters Section Component
const VotersSection = ({ formType, setFormType, votersData, setVotersData, currentPage, setCurrentPage, pageSize, setPageSize, onGetAll, onGetSingle }) => {
  const [voterId, setVoterId] = useState('');

  return (
    <div className={styles.contentSection}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Voter Management</h1>
        <p className={styles.pageSubtitle}>View and manage registered voters</p>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>👥</span>
            Voters
          </h2>
        </div>

        <div className={styles.actionGrid}>
          <div className={styles.actionCard} onClick={() => setFormType('all')}>
            <div className={styles.actionCardHeader}>
              <div className={`${styles.actionIcon} ${styles.view}`}>📋</div>
              <div>
                <div className={styles.actionTitle}>Get All Voters</div>
                <div className={styles.actionDescription}>View paginated list of all voters</div>
              </div>
            </div>
          </div>

          <div className={styles.actionCard} onClick={() => setFormType('single')}>
            <div className={styles.actionCardHeader}>
              <div className={`${styles.actionIcon} ${styles.view}`}>🔍</div>
              <div>
                <div className={styles.actionTitle}>Get Voter by ID</div>
                <div className={styles.actionDescription}>Search specific voter details</div>
              </div>
            </div>
          </div>
        </div>

        {formType === 'all' && (
          <div className={styles.inputForm}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Get All Voters (Paginated)</h3>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Page Number</label>
                <input 
                  type="number" 
                  className={styles.inputField}
                  placeholder="1"
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
                  min="1"
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Page Size</label>
                <input 
                  type="number" 
                  className={styles.inputField}
                  placeholder="10"
                  value={pageSize}
                  onChange={(e) => setPageSize(parseInt(e.target.value) || 10)}
                  min="1"
                />
              </div>
            </div>
            <div className={styles.btnGroup}>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onGetAll}>
                <span>📋</span> Fetch Voters
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => { setFormType(null); setVotersData([]); }}>
                <span>✗</span> Clear
              </button>
            </div>
          </div>
        )}

        {formType === 'single' && (
          <div className={styles.inputForm}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Get Voter by ID</h3>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Voter ID</label>
              <input 
                type="text" 
                className={styles.inputField}
                placeholder="Enter Voter ID"
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
              />
            </div>
            <div className={styles.btnGroup}>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onGetSingle(voterId)}>
                <span>🔍</span> Search Voter
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => { setFormType(null); setVotersData([]); }}>
                <span>✗</span> Clear
              </button>
            </div>
          </div>
        )}

        {votersData.length > 0 && (
          <>
            <div className={styles.dataTable}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {votersData.map((voter) => (
                    <tr key={voter.id}>
                      <td>{voter.id}</td>
                      <td>{voter.name}</td>
                      <td>{voter.email}</td>
                      <td>{voter.age}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[`badge${voter.status === 'Active' ? 'Success' : 'Warning'}`]}`}>
                          {voter.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.pagination}>
              <button 
                className={styles.paginationBtn}
                onClick={() => { setCurrentPage(currentPage - 1); onGetAll(); }}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button className={`${styles.paginationBtn} ${styles.active}`}>{currentPage}</button>
              <button 
                className={styles.paginationBtn}
                onClick={() => { setCurrentPage(currentPage + 1); onGetAll(); }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Votes Section Component
const VotesSection = ({ formType, setFormType, votesData, setVotesData, onGetAll, onGetSingle }) => {
  const [contractAddress, setContractAddress] = useState('');
  const [candidateId, setCandidateId] = useState('');

  const totalVotes = votesData.reduce((sum, v) => sum + v.votes, 0);

  return (
    <div className={styles.contentSection}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Vote Results</h1>
        <p className={styles.pageSubtitle}>View vote counts and analytics</p>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📈</span>
            Vote Results
          </h2>
        </div>

        <div className={styles.actionGrid}>
          <div className={styles.actionCard} onClick={() => setFormType('all')}>
            <div className={styles.actionCardHeader}>
              <div className={`${styles.actionIcon} ${styles.view}`}>📊</div>
              <div>
                <div className={styles.actionTitle}>All Candidate Votes</div>
                <div className={styles.actionDescription}>View votes for all candidates</div>
              </div>
            </div>
          </div>

          <div className={styles.actionCard} onClick={() => setFormType('single')}>
            <div className={styles.actionCardHeader}>
              <div className={`${styles.actionIcon} ${styles.view}`}>🎯</div>
              <div>
                <div className={styles.actionTitle}>Single Candidate Votes</div>
                <div className={styles.actionDescription}>Check votes for specific candidate</div>
              </div>
            </div>
          </div>
        </div>

        {formType === 'all' && (
          <div className={styles.inputForm}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Get All Candidate Votes</h3>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Contract Address</label>
              <input 
                type="text" 
                className={styles.inputField}
                placeholder="0x123...abc"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
              />
            </div>
            <div className={styles.btnGroup}>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onGetAll(contractAddress)}>
                <span>📊</span> Get All Votes
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => { setFormType(null); setVotesData([]); }}>
                <span>✗</span> Clear
              </button>
            </div>
          </div>
        )}

        {formType === 'single' && (
          <div className={styles.inputForm}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Get Single Candidate Votes</h3>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Contract Address</label>
              <input 
                type="text" 
                className={styles.inputField}
                placeholder="0x123...abc"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Candidate ID</label>
              <input 
                type="text" 
                className={styles.inputField}
                placeholder="Enter Candidate ID"
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
              />
            </div>
            <div className={styles.btnGroup}>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onGetSingle(contractAddress, candidateId)}>
                <span>🎯</span> Get Candidate Votes
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => { setFormType(null); setVotesData([]); }}>
                <span>✗</span> Clear
              </button>
            </div>
          </div>
        )}

        {votesData.length > 0 && (
          <>
            <div className={styles.dataTable}>
              <table>
                <thead>
                  <tr>
                    <th>Candidate ID</th>
                    <th>Name</th>
                    <th>Party</th>
                    <th>Votes</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {votesData.map((vote) => (
                    <tr key={vote.candidateId}>
                      <td>{vote.candidateId}</td>
                      <td>{vote.name}</td>
                      <td>{vote.party}</td>
                      <td><strong>{vote.votes.toLocaleString()}</strong></td>
                      <td>
                        <span className={`${styles.badge} ${styles.badgeInfo}`}>
                          {((vote.votes / totalVotes) * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ 
              marginTop: '16px', 
              padding: '16px', 
              background: 'var(--bg-secondary)', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)' 
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>Total Votes Cast:</strong>{' '}
              <span style={{ color: 'var(--accent-1)', fontSize: '20px', fontWeight: '700' }}>
                {totalVotes.toLocaleString()}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
