import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false); // Close menu on navigation
  };

  return (
    <div className="wrap">
      <header className="nav">
        <div className="brand">
          <div className="logo-box">ECI</div>
          <div className="brand-text">
            <h1>MY VOTE</h1>
            <div className="subtitle">Voting is my duty and right</div>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="hamburger"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            style={{ color: 'var(--muted)' }}
          >
            <path
              d="M4 7h16M4 12h16M4 17h16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          <button onClick={() => handleNavigation('/login')}>Log In</button>
          <button onClick={() => handleNavigation('/signup')}>Sign Up</button>
          <button onClick={() => handleNavigation('/documentation')}>Documentation</button>
          <button disabled>Help (coming soon)</button>
        </nav>
      </header>

      <main className="hero">
        <section className="hero-left">
          <span className="eyebrow">Authorized Voting Portal</span>
          <h2>
            Vote now and <span className="fancy-underline">Shape Tomorrow</span>
          </h2>
          <p className="lead">
            Through this platform you can Vote and access other voting related services.
          </p>

          <div className="features" id="features">
            <article className="card">
              <h3>Voting Right</h3>
              <p>
                You have specific rights and privileges as a voter, guaranteed by the Constitution.
              </p>
            </article>
            <article className="card">
              <h3>Indian Democracy</h3>
              <p>
                India has a parliamentary system as defined by its constitution, with power
                distributed between the union government and the states.
              </p>
            </article>
            <article className="card">
              <h3>Election Commission of India (ECI)</h3>
              <p>
                The Election Commission of India (ECI) is an autonomous authority of India that
                is enacted under the provisions of the Constitution.
              </p>
            </article>
          </div>

          <div className="testimonials" id="testimonials">
            <div
              style={{
                padding: '14px 0 0 2px',
                color: 'var(--muted)',
                fontWeight: 700,
              }}
            >
              What people say
            </div>
            <div className="t-track" style={{ marginTop: '14px' }}>
              <div className="t">
                <p>
                  "The danger is not that a particular class is unfit to govern. Every class is
                  unfit to govern."
                </p>
                <strong>- Lord Acton</strong>
              </div>
              <div className="t">
                <p>
                  "Liberty cannot be preserved without a general knowledge among the people, who
                  have a right … and a desire to know."
                </p>
                <strong>- John Adams</strong>
              </div>
              <div className="t">
                <p>"Dictatorships are one-way streets. Democracy boasts two-way traffic."</p>
                <strong>- Albert Moravia</strong>
              </div>
            </div>
          </div>
        </section>

        <aside className="hero-right">
          <div className="blob b1" aria-hidden="true"></div>
          <div className="blob b2" aria-hidden="true"></div>

          <div className="device" role="img" aria-label="Animated mockup">
            <div className="screen">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg,var(--accent-1),var(--accent-2))',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 700,
                  }}
                >
                  ECI
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      height: '10px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '6px',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      paddingInline: '4px',
                      fontSize: '10px',
                    }}
                  >
                    Election Commission of
                  </div>
                  <div
                    style={{
                      height: '8px',
                      width: '68%',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      paddingInline: '4px',
                      fontSize: '9px',
                    }}
                  >
                    India
                  </div>
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    height: '10px',
                    width: '92%',
                    background:
                      'linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                    borderRadius: '6px',
                    transform: 'translateX(-2px)',
                    animation: 'screenShimmer 10s linear infinite',
                  }}
                ></div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div
                    style={{
                      flex: 1,
                      height: '76px',
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
                      borderRadius: '10px',
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        height: '8px',
                        width: '60%',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        paddingInline: '4px',
                        fontSize: '9px',
                      }}
                    >
                      Polling percentage
                    </div>
                    <div
                      style={{
                        height: '8px',
                        width: '80%',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '6px',
                      }}
                    ></div>
                  </div>
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg,var(--accent-2),var(--accent-1))',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
                    }}
                  >
                    69.74%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <footer>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ fontWeight: 700 }}>© {new Date().getFullYear()} My Vote</div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
