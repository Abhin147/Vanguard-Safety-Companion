import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'login' | 'dashboard'
  const [username, setUsername] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [isSosActive, setIsSosActive] = useState(false);

  const [routeConfig, setRouteConfig] = useState({
    origin: '',
    destination: ''
  });

  const [progressData, setProgressData] = useState({
    currentTime: '23:45',
    nextTime: '00:15',
    currentLocation: 'Central Business District',
    nextLocation: 'Residential Sector 4',
  });
  const [contacts, setContacts] = useState([
    { name: 'Emergency Primary', status: 'Always Notified' },
    { name: 'Roommate', status: 'Notified after 23:00' }
  ]);
  const [showContacts, setShowContacts] = useState(false);
  const [showNetwork, setShowNetwork] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');

  // Handle Escape key to close modals
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowContacts(false);
        setShowNetwork(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Simulated live location progress
  useEffect(() => {
    let interval;
    if (isTracking && !isSosActive) {
      interval = setInterval(() => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setProgressData(prev => ({
          ...prev,
          currentTime: timeStr
        }));
      }, 60000); // update every minute realistically, but we just simulate
    }
    return () => clearInterval(interval);
  }, [isTracking, isSosActive]);

  // SOS Alarm Sound Effect
  useEffect(() => {
    if (!isSosActive) return;

    let audioCtx = null;
    let alarmInterval = null;

    const playSiren = () => {
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        // Siren frequency shift
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.4);
        oscillator.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.8);

        // Volume contour to prevent clipping
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.8);
      } catch (e) {
        console.warn("AudioContext not supported or blocked.", e);
      }
    };

    // Play immediately, then loop
    playSiren();
    alarmInterval = setInterval(playSiren, 1000);

    return () => {
      clearInterval(alarmInterval);
      if (audioCtx) {
        audioCtx.close().catch(e => console.warn(e));
      }
    };
  }, [isSosActive]);

  const toggleTracking = () => {
    if (isSosActive) return; // Prevent changing tracking if SOS is active

    // When activating tracking, snapshot the inputs into the active progress data
    if (!isTracking) {
      const now = new Date();
      const currentFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const later = new Date(now.getTime() + 30 * 60000); // +30 minutes
      const laterFormatted = later.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setProgressData(prev => ({
        ...prev,
        currentTime: currentFormatted,
        nextTime: laterFormatted,
        currentLocation: routeConfig.origin || 'Central Business District',
        nextLocation: routeConfig.destination || 'Selected Destination'
      }));
    }

    setIsTracking(!isTracking);
  };

  const toggleSos = () => {
    setIsSosActive(!isSosActive);
    if (!isSosActive) setIsTracking(true); // SOS forces tracking on
  };

  const submitNewContact = (e) => {
    e.preventDefault();
    if (newContactName.trim()) {
      setContacts([...contacts, { name: newContactName.trim(), status: 'Active' }]);
      setNewContactName('');
      setIsAddingContact(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username) setUsername('Alex');
    setCurrentView('dashboard');
  };

  return (
    <div className={`app-wrapper ${isSosActive ? 'sos-active-theme' : ''}`}>
      <nav className="navbar">
        <div className="container nav-container">
          <div className="brand" onClick={() => setCurrentView('landing')} style={{ cursor: 'pointer' }}>
            <div className={`brand-dot ${isTracking ? 'pulsing-dot' : ''}`}></div>
            <span>Vanguard Companion</span>
          </div>
          {currentView === 'landing' && (
            <div className="nav-links desktop-only">
              <a href="#features">Features</a>
              <a href="#how-it-works">How it Works</a>
              <a href="#safety-network">Safety Network</a>
            </div>
          )}
          {currentView === 'dashboard' && (
            <div className="nav-links desktop-only">
              <span style={{ fontWeight: 600, color: 'var(--color-olive)' }}>Welcome back, {username}.</span>
            </div>
          )}
          <button
            className="btn-secondary nav-action"
            onClick={() => setCurrentView(currentView === 'landing' ? 'login' : 'landing')}
          >
            {currentView === 'dashboard' ? 'Sign Out' : (isTracking ? 'Connected' : 'Get Started')}
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentView === 'landing' && (
          <>
            <section className="hero">
              <div className="container hero-content">
                <div className="hero-text">
                  <span className={`badge ${isSosActive ? 'badge-alert' : ''}`}>
                    {isSosActive ? 'EMERGENCY PROTOCOL ACTIVE' : 'Professional Safety Solution'}
                  </span>
                  <h1>
                    Late-Night Journeys,<br />
                    {isSosActive ? 'Critical Response Initiated' : 'Secured with Confidence'}
                  </h1>
                  <p className="hero-description">
                    {isSosActive
                      ? 'Local authorities and your priority response network have been notified. Maintain current position if safe.'
                      : 'A definitive safety companion designed to provide continuous monitoring and rapid response capabilities during evening transits.'}
                  </p>
                  <div className="hero-actions">
                    <button
                      className={`btn-primary ${isTracking ? 'btn-active' : ''}`}
                      onClick={toggleTracking}
                    >
                      {isTracking ? 'Deactivate Tracking' : 'Activate Tracking'}
                    </button>
                    <button
                      className={`btn-sos ${isSosActive ? 'btn-sos-active' : ''}`}
                      onClick={toggleSos}
                    >
                      {isSosActive ? 'Cancel SOS' : 'Emergency SOS'}
                    </button>
                  </div>
                </div>

                <div className="hero-visual">
                  <div className={`glass-panel tracking-card ${isSosActive ? 'tracking-alert' : ''}`}>
                    <div className="status-header">
                      <div className={`pulse-indicator ${isTracking ? 'active' : ''}`}></div>
                      <span>
                        {!isTracking && !isSosActive && 'Tracking Inactive'}
                        {isTracking && !isSosActive && 'Active Monitored Route'}
                        {isSosActive && 'EMERGENCY SIGNAL BROADCASTING'}
                      </span>
                    </div>

                    <div className={`route-details ${!isTracking ? 'dimmed' : ''}`}>
                      <div className="location-node">
                        <span className="time">{progressData.currentTime}</span>
                        <span className="place">{progressData.currentLocation}</span>
                      </div>
                      <div className="route-line"></div>
                      <div className="location-node pending">
                        <span className="time">{progressData.nextTime}</span>
                        <span className="place">{progressData.nextLocation}</span>
                      </div>
                    </div>

                    {isTracking && (
                      <div className="verification-status">
                        <div className="shield-icon"></div>
                        <span>Driver Identity Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section id="features" className="features-section">
              <div className="container">
                <div className="section-header">
                  <h2>Core Capabilities</h2>
                  <p>Engineered for maximum reliability when it matters most.</p>
                </div>

                <div className="features-grid">
                  <div className="feature-card glass-panel">
                    <div className="feature-icon icon-tracking"></div>
                    <h3>Real-Time Telemetry</h3>
                    <p>Continuous location tracking shared securely with your designated trusted contacts throughout the journey.</p>
                  </div>

                  <div className="feature-card glass-panel">
                    <div className="feature-icon icon-alert"></div>
                    <h3>Automated Anomalies</h3>
                    <p>Intelligent detection of route deviations or unexpected stops, triggering immediate verification protocols.</p>
                  </div>

                  <div className="feature-card glass-panel">
                    <div className="feature-icon icon-network"></div>
                    <h3>Priority Response Network</h3>
                    <p>Direct integration with local authorities and premium response units for critical intervention.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="how-it-works" className="features-section" style={{ backgroundColor: 'var(--color-bg)' }}>
              <div className="container">
                <div className="section-header">
                  <h2>How it Works</h2>
                  <p>Three simple steps to secure your night-time transits.</p>
                </div>
                <div className="features-grid">
                  <div className="feature-card glass-panel" style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '3rem', color: 'var(--color-olive)', marginBottom: '16px' }}>1</h3>
                    <h3>Activate Before Transit</h3>
                    <p>Launch Vanguard Companion and start your route tracking before you enter a vehicle or begin walking.</p>
                  </div>
                  <div className="feature-card glass-panel" style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '3rem', color: 'var(--color-yellow)', marginBottom: '16px' }}>2</h3>
                    <h3>Live Monitoring</h3>
                    <p>Our systems track your progress, verifying stops and delays against expected route timing.</p>
                  </div>
                  <div className="feature-card glass-panel" style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '3rem', color: 'var(--color-text-main)', marginBottom: '16px' }}>3</h3>
                    <h3>Arrive Safely</h3>
                    <p>Upon arrival, deactivate tracking. If an anomaly occurs, your emergency protocols trigger instantly.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="safety-network" className="hero" style={{ minHeight: '60vh', padding: '100px 0' }}>
              <div className="container hero-content" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
                <div className="hero-text" style={{ alignItems: 'center' }}>
                  <span className="badge">The Network</span>
                  <h2>Your Priority Safety Network</h2>
                  <p className="hero-description" style={{ margin: '0 auto' }}>
                    Vanguard integrates seamlessly with trusted contacts, local authorities, and premium 24/7 emergency dispatch centers to ensure you are never truly alone on your journey.
                  </p>
                  <div className="hero-actions" style={{ justifyContent: 'center' }}>
                    <button className="btn-secondary" onClick={() => setShowContacts(true)}>Manage Contacts</button>
                    <button className="btn-primary" onClick={() => setShowNetwork(true)}>View Response Units</button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {currentView === 'login' && (
          <section className="login-section">
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <div className="glass-panel login-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Sign In</h2>
                  <p style={{ color: 'var(--color-text-muted)' }}>Access your personalized safety dashboard.</p>
                </div>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Your Name</label>
                    <input type="text" required placeholder="e.g., Alex" className="form-input" value={username} onChange={e => setUsername(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Email Address</label>
                    <input type="email" required placeholder="you@example.com" className="form-input" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Security PIN / Password</label>
                    <input type="password" required placeholder="••••••••" className="form-input" />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px' }}>Secure Login</button>
                </form>
              </div>
            </div>
          </section>
        )}

        {currentView === 'dashboard' && (
          <section className="dashboard-section" style={{ padding: '120px 0 60px' }}>
            <div className="container">
              <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Personal Dashboard</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Manage your active journeys, emergency protocols, and trusted network.</p>
              </div>

              <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>

                {/* Active Tracking Module */}
                <div className={`glass-panel tracking-card ${isSosActive ? 'tracking-alert' : ''}`} style={{ maxWidth: 'none', animation: 'none' }}>
                  <div className="status-header">
                    <div className={`pulse-indicator ${isTracking ? 'active' : ''}`}></div>
                    <span>
                      {!isTracking && !isSosActive && 'Configure Your Route'}
                      {isTracking && !isSosActive && 'Active Monitored Route'}
                      {isSosActive && 'EMERGENCY SIGNAL BROADCASTING'}
                    </span>
                  </div>

                  <div className={`route-details`} style={{ margin: '24px 0' }}>
                    {!isTracking ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', opacity: 1, filter: 'none', pointerEvents: 'auto' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Starting Point</label>
                          <input type="text" className="form-input" placeholder="e.g., Central Station" value={routeConfig.origin} onChange={e => setRouteConfig({ ...routeConfig, origin: e.target.value })} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Destination</label>
                          <input type="text" className="form-input" placeholder="e.g., Home (Sector 4)" value={routeConfig.destination} onChange={e => setRouteConfig({ ...routeConfig, destination: e.target.value })} />
                        </div>
                      </div>
                    ) : (
                      <div className={`route-nodes`}>
                        <div className="location-node">
                          <span className="time">{progressData.currentTime}</span>
                          <span className="place">{progressData.currentLocation}</span>
                        </div>
                        <div className="route-line"></div>
                        <div className="location-node pending">
                          <span className="time">{progressData.nextTime}</span>
                          <span className="place">{progressData.nextLocation}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                    <button className={`btn-primary ${isTracking ? 'btn-active' : ''}`} style={{ flex: 1 }} onClick={toggleTracking}>
                      {isTracking ? 'Deactivate' : 'Start Route'}
                    </button>
                    <button className={`btn-sos ${isSosActive ? 'btn-sos-active' : ''}`} style={{ padding: '12px 24px' }} onClick={toggleSos}>
                      SOS
                    </button>
                  </div>
                </div>

                {/* Dashboard Tools */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--color-yellow)' }}>-</span> Quick Access
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <button className="btn-secondary" style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }} onClick={() => setShowContacts(true)}>
                        Manage Trusted Contacts <span>→</span>
                      </button>
                      <button className="btn-secondary" style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }} onClick={() => setShowNetwork(true)}>
                        View Response Units <span>→</span>
                      </button>
                    </div>
                  </div>

                  <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'var(--color-bg)' }}>
                    <h3 style={{ marginBottom: '16px' }}>Past Journeys</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>City Center to Home</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Yesterday, 23:30</div>
                      </div>
                      <div style={{ color: 'var(--color-olive)', fontWeight: 600 }}>Safe</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}
      </main>

      {/* Modals using simple conditional rendering */}
      {showContacts && (
        <div className="modal-overlay" onClick={() => setShowContacts(false)}>
          <div className="modal-content glass-panel" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Trusted Contacts</h3>
              <button className="close-btn" aria-label="Close" onClick={() => setShowContacts(false)}>×</button>
            </div>
            <div className="modal-body">
              {contacts.map((contact, idx) => (
                <div className="contact-item" key={`${contact.name}-${idx}`}>
                  <div className="contact-avatar" style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>C</div>
                  <div className="contact-info">
                    <strong>{contact.name}</strong>
                    <span>{contact.status}</span>
                  </div>
                </div>
              ))}
              {!isAddingContact ? (
                <button className="btn-secondary" style={{ width: '100%', marginTop: '16px' }} onClick={() => setIsAddingContact(true)}>
                  + Add New Contact
                </button>
              ) : (
                <form onSubmit={submitNewContact} style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <input type="text" className="form-input" style={{ flex: 1, padding: '8px 12px' }} placeholder="Name (e.g. Mom)" autoFocus value={newContactName} onChange={e => setNewContactName(e.target.value)} />
                  <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>Add</button>
                  <button type="button" className="btn-secondary" style={{ padding: '8px 16px' }} onClick={() => setIsAddingContact(false)}>Cancel</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {showNetwork && (
        <div className="modal-overlay" onClick={() => setShowNetwork(false)}>
          <div className="modal-content glass-panel" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Active Response Units</h3>
              <button className="close-btn" aria-label="Close" onClick={() => setShowNetwork(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="contact-item" style={{ borderLeft: '4px solid var(--color-olive)' }}>
                <div className="contact-avatar" style={{ background: 'var(--color-olive)', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>P42</div>
                <div className="contact-info">
                  <strong>Local Precinct #42</strong>
                  <span>Est. Response: 4 mins</span>
                </div>
              </div>
              <div className="contact-item" style={{ borderLeft: '4px solid var(--color-yellow)' }}>
                <div className="contact-avatar" style={{ background: 'var(--color-yellow)', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>MED</div>
                <div className="contact-info">
                  <strong>Medical Dispatch Center</strong>
                  <span>Est. Response: 7 mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span>Vanguard Companion</span>
              <p>Ensuring secure transits globally.</p>
            </div>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
