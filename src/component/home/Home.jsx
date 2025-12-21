import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

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
            style={{ color: "var(--muted)" }}
          >
            <path
              d="M4 7h16M4 12h16M4 17h16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <button onClick={() => handleNavigation("/login")}>Log In</button>
          <button onClick={() => handleNavigation("/signup")}>Sign Up</button>
          <button onClick={() => handleNavigation("/documentation")}>
            Documentation
          </button>
          <button
            onClick={() =>
              window.open(
                "https://youtube.com",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            User guide
          </button>
        </nav>
      </header>

      <main className="hero">
        <section className="hero-left">
          <span className="eyebrow">Authorized Voting Portal</span>
          <h2>
            Vote now and <span className="fancy-underline">Shape Tomorrow</span>
          </h2>
          <p className="lead">
            Through this platform you can Vote and access other voting related
            services.
          </p>

          <div className="features" id="features">
            <article className="card">
              <h3>Voting Right</h3>
              <p>
                You have specific rights and privileges as a voter, guaranteed
                by the Constitution.
              </p>
            </article>
            <article className="card">
              <h3>Indian Democracy</h3>
              <p>
                India has a parliamentary system as defined by its constitution,
                with power distributed between the union government and the
                states.
              </p>
            </article>
            <article className="card">
              <h3>Election Commission of India (ECI)</h3>
              <p>
                The Election Commission of India (ECI) is an autonomous
                authority of India that is enacted under the provisions of the
                Constitution.
              </p>
            </article>
          </div>

          <div className="testimonials" id="testimonials">
            <div
              style={{
                padding: "14px 0 0 2px",
                color: "var(--muted)",
                fontWeight: 700,
              }}
            >
              What people say
            </div>
            <div className="t-track" style={{ marginTop: "14px" }}>
              <div className="t">
                <p>
                  "The danger is not that a particular class is unfit to govern.
                  Every class is unfit to govern."
                </p>
                <strong>- Lord Acton</strong>
              </div>
              <div className="t">
                <p>
                  "Liberty cannot be preserved without a general knowledge among
                  the people, who have a right … and a desire to know."
                </p>
                <strong>- John Adams</strong>
              </div>
              <div className="t">
                <p>
                  "Dictatorships are one-way streets. Democracy boasts two-way
                  traffic."
                </p>
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
              {/* Header Section */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "54px",
                    height: "54px",
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: "16px",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  🗳️
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.95)",
                      marginBottom: "4px",
                    }}
                  >
                    Election Commission
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.6)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#22c55e",
                        animation: "pulse 2s ease-in-out infinite",
                      }}
                    ></span>
                    Live Dashboard
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))",
                    borderRadius: "12px",
                    padding: "12px",
                    border: "1px solid rgba(34, 197, 94, 0.2)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "9px",
                      color: "rgba(255,255,255,0.6)",
                      marginBottom: "6px",
                    }}
                  >
                    Total Voters
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#22c55e",
                    }}
                  >
                    950M+
                  </div>
                </div>

                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))",
                    borderRadius: "12px",
                    padding: "12px",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "9px",
                      color: "rgba(255,255,255,0.6)",
                      marginBottom: "6px",
                    }}
                  >
                    Active Elections
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#3b82f6",
                    }}
                  >
                    24
                  </div>
                </div>
              </div>

              {/* Polling Percentage Card */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.15))",
                  borderRadius: "14px",
                  padding: "14px",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(168, 85, 247, 0.2), transparent)",
                    animation: "float 6s ease-in-out infinite",
                  }}
                ></div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.7)",
                        marginBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span>📊</span>
                      National Turnout
                    </div>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: 900,
                        background: "linear-gradient(135deg, #a855f7, #ec4899)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      67.4%
                    </div>
                    <div
                      style={{
                        fontSize: "9px",
                        color: "rgba(255,255,255,0.5)",
                        marginTop: "4px",
                      }}
                    >
                      2024 General Elections
                    </div>
                  </div>

                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background:
                        "conic-gradient(#a855f7 0% 67.4%, rgba(255,255,255,0.1) 67.4% 100%)",
                      display: "grid",
                      placeItems: "center",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "46px",
                        height: "46px",
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.4)",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "10px",
                        fontWeight: 700,
                      }}
                    >
                      ↑ 3%
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    marginTop: "12px",
                    height: "6px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "3px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "67.4%",
                      height: "100%",
                      background: "linear-gradient(90deg, #a855f7, #ec4899)",
                      borderRadius: "3px",
                      animation: "progressGrow 2s ease-out",
                    }}
                  ></div>
                </div>
              </div>

              {/* Quick Stats Row */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "12px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "10px",
                    padding: "10px",
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 800,
                      color: "#f59e0b",
                      marginBottom: "2px",
                    }}
                  >
                    543
                  </div>
                  <div
                    style={{
                      fontSize: "8px",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    Lok Sabha Seats
                  </div>
                </div>

                <div
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "10px",
                    padding: "10px",
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 800,
                      color: "#06b6d4",
                      marginBottom: "2px",
                    }}
                  >
                    28
                  </div>
                  <div
                    style={{
                      fontSize: "8px",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    States & UTs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <footer>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <div style={{ fontWeight: 700 }}>
            © {new Date().getFullYear()} My Vote
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
