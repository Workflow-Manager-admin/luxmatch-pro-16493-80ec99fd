// React and Router imports
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

// PUBLIC_INTERFACE
function Navbar() {
  const location = useLocation();
  return (
    <nav className="lm-navbar">
      <div className="lm-navbar-container">
        <div className="lm-logo">
          <span className="lm-logo-symbol">★</span> LuxMatch Pro
        </div>
        <div className="lm-navlinks">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link>
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
        </div>
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function Card({ children }) {
  return <div className="lm-card">{children}</div>;
}

// PUBLIC_INTERFACE
function Home() {
  return (
    <div className="lm-center-vertical">
      <Card>
        <h2 className="lm-gradient-text">Welcome to LuxMatch Pro</h2>
        <p>
          Unlock luxury career growth. Discover your top job matches and learn which skills to hone for maximum professional impact. Navigate your future in style.
        </p>
        <div className="lm-home-actions">
          <Link className="lm-btn lm-btn-primary" to="/profile">Get Started</Link>
        </div>
      </Card>
    </div>
  );
}

 
/**
 * Profile component: Now includes 'role' and 'domainName' controlled fields.
 */
// PUBLIC_INTERFACE
function Profile({
  name, setName,
  skillsInput, setSkillsInput,
  goals, setGoals,
  role, setRole,
  domainName, setDomainName,
  handleAnalyze
}) {
  const navigate = useNavigate();

  // Handle form submit: analyze profile, then redirect to dashboard
  function handleAnalyzeAndRedirect() {
    handleAnalyze();
    navigate("/dashboard");
  }

  return (
    <div className="lm-center-vertical">
      <Card>
        <h2 className="lm-gradient-text">Profile Analysis</h2>
        <form
          onSubmit={e => { e.preventDefault(); handleAnalyzeAndRedirect(); }}
          className="lm-form"
        >
          <label>
            Name
            <input
              type="text"
              value={name}
              required
              placeholder="Your Name"
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            Skills <span className="lm-label-note">(comma separated)</span>
            <input
              type="text"
              value={skillsInput}
              required
              placeholder="e.g., JavaScript, Communication, Problem Solving"
              onChange={e => setSkillsInput(e.target.value)}
            />
          </label>
          <label>
            Career Goals
            <input
              type="text"
              value={goals}
              required
              placeholder="e.g., Frontend Engineer, Team Lead"
              onChange={e => setGoals(e.target.value)}
            />
          </label>
          <label>
            Role
            <input
              type="text"
              value={role}
              required
              placeholder="e.g., Frontend Developer, Data Analyst"
              onChange={e => setRole(e.target.value)}
            />
          </label>
          <label>
            Domain Name
            <input
              type="text"
              value={domainName}
              required
              placeholder="e.g., IT, Healthcare, Finance"
              onChange={e => setDomainName(e.target.value)}
            />
          </label>
          <button className="lm-btn lm-btn-primary lm-btn-block" type="submit">Analyze</button>
        </form>
      </Card>
    </div>
  );
}

// PUBLIC_INTERFACE
function Dashboard({ profile, jobs, recommendations }) {
  return (
    <div className="lm-center-vertical">
      <Card>
        <h2 className="lm-gradient-text">Your Dashboard</h2>
        <p style={{marginBottom: 24}}>
          <strong>{profile.name || "User"}</strong>, based on your skills and ambitions, here's what we found:
        </p>
        <div className="lm-dashboard-section">
          <h3>Top Job Matches</h3>
          <div className="lm-jobs">
            {jobs.map((job, i) => (
              <div key={i} className="lm-dashboard-card-lux">
                <div className="lm-job-title">{job.title}</div>
                <div className="lm-job-matches">
                  Matches: <strong>{job.matchPercent}%</strong>
                </div>
                <div className="lm-job-shortdesc">{job.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="lm-dashboard-section" style={{marginTop: 36}}>
          <h3>Skill Recommendations</h3>
          <ul className="lm-skill-list">
            {recommendations.map((skill, i) => (
              <li key={i}><span className="lm-skill-dot">•</span> {skill}</li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}

// PUBLIC_INTERFACE
function About() {
  return (
    <div className="lm-center-vertical">
      <Card>
        <h2 className="lm-gradient-text">About LuxMatch Pro</h2>
        <p>
          LuxMatch Pro is a modern career advisor web application offering job recommendations and custom skill paths in a refined, luxury-inspired user experience.
        </p>
        <p>
          <strong>Features:</strong>
          <ul>
            <li>Profile-driven job and skill recommendations</li>
            <li>Responsive luxury-themed layout</li>
            <li>Interactive dashboard for professional growth</li>
          </ul>
        </p>
        <p style={{marginTop: 24, fontSize: ".95rem", color: "#666"}}>
          &copy; 2024 LuxMatch Pro | Crafted for excellence and aspiration.
        </p>
      </Card>
    </div>
  );
}

// PUBLIC_INTERFACE
function NotFound() {
  return (
    <div className="lm-center-vertical">
      <Card>
        <h2>404</h2>
        <p>Page not found.</p>
        <Link className="lm-btn" to="/">Go Home</Link>
      </Card>
    </div>
  );
}

// PUBLIC_INTERFACE
function LuxMatchProApp() {
  // State for Profile
  const [name, setName] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [goals, setGoals] = useState('');
  const [analyzed, setAnalyzed] = useState(false);

  // Results state after analysis
  const [profile, setProfile] = useState({});
  const [jobMatches, setJobMatches] = useState([]);
  const [skillRecommendations, setSkillRecommendations] = useState([]);

  // PUBLIC_INTERFACE
  function handleAnalyze() {
    // Simple mock analysis logic
    const skills = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    setProfile({ name, skills, goals });

    // --- Mock job matching ---
    // (In real app, would use API/matching logic)
    const mockJobsList = [
      { title: 'Frontend Developer', requiredSkills: ['JavaScript', 'React'], desc: 'Build rich user interfaces for modern web platforms.' },
      { title: 'Project Manager', requiredSkills: ['Communication', 'Leadership'], desc: 'Lead teams to project success in luxury industries.' },
      { title: 'UX Designer', requiredSkills: ['UX', 'Creativity'], desc: 'Craft user experiences for high-end clientele.' },
      { title: 'Sales Executive', requiredSkills: ['Negotiation', 'Charisma'], desc: 'Drive business growth and client satisfaction.' }
    ];
    // Match jobs by overlap with entered skills and soft match to goal
    const matches = mockJobsList
      .map(job => ({
        ...job,
        matchCount: skills.filter(skill =>
          job.requiredSkills.map(rs => rs.toLowerCase()).includes(skill.toLowerCase())
        ).length +
        (goals && job.title.toLowerCase().includes(goals.toLowerCase()) ? 1 : 0)
      }))
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 2)
      .map(job => ({
        ...job,
        matchPercent: Math.min(100, 70 + job.matchCount * 10)
      }));

    setJobMatches(matches);

    // --- Mock skill recommendation logic ---
    const possibleSkills = [
      'React', 'Team Leadership', 'Python', 'UI Design', 'Negotiation',
      'Business Strategy', 'Marketing', 'Creativity', 'Data Analysis', 'Communication'
    ];
    // Only recommend skills not already listed
    let recommended = possibleSkills.filter(
      s => !skills.map(ss => ss.toLowerCase()).includes(s.toLowerCase())
    );
    // Randomize and pick 5
    recommended = recommended.sort(() => 0.5 - Math.random()).slice(0, 5);

    setSkillRecommendations(recommended);
    setAnalyzed(true);
  }

  return (
    <Router>
      <div className="lm-app-gradient">
        <Navbar />
        <main className="lm-main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/profile"
              element={
                <Profile
                  name={name}
                  setName={setName}
                  skillsInput={skillsInput}
                  setSkillsInput={setSkillsInput}
                  goals={goals}
                  setGoals={setGoals}
                  handleAnalyze={handleAnalyze}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                analyzed && profile.name
                  ? <Dashboard profile={profile} jobs={jobMatches} recommendations={skillRecommendations} />
                  : <Card><p>Please complete your <Link to="/profile">profile analysis</Link> first!</p></Card>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default LuxMatchProApp;
