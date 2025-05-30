import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './App.css';

// PUBLIC_INTERFACE
function Navbar() {
  // Navigation bar with links to all main pages
  return (
    <nav className="navbar">
      <div className="container" style={{ flexDirection: 'row', display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="logo" style={{ color: '#ff0026', fontWeight: 'bold', fontFamily: 'Inter, sans-serif', letterSpacing: 1 }}>
          <span className="logo-symbol" style={{ fontSize: 26, color: '#3400ff', marginRight: 6 }}>&#9733;</span>
          LuxMatch <span style={{ color: '#3400ff', marginLeft: 2 }}>Pro</span>
        </span>
        <div style={{ display: 'flex', gap: '18px' }}>
          <NavLink exact="true" to="/" className="nav-link" style={({ isActive }) => ({
            color: isActive ? '#ff0026' : '#fff',
            textDecoration: 'none',
            fontWeight: 500,
            borderBottom: isActive ? '2px solid #ff0026' : 'none',
            paddingBottom: '2px'
          })}>Home</NavLink>
          <NavLink to="/profile" className="nav-link" style={({ isActive }) => ({
            color: isActive ? '#ff0026' : '#fff',
            textDecoration: 'none',
            fontWeight: 500,
            borderBottom: isActive ? '2px solid #ff0026' : 'none',
            paddingBottom: '2px'
          })}>Profile</NavLink>
          <NavLink to="/dashboard" className="nav-link" style={({ isActive }) => ({
            color: isActive ? '#ff0026' : '#fff',
            textDecoration: 'none',
            fontWeight: 500,
            borderBottom: isActive ? '2px solid #ff0026' : 'none',
            paddingBottom: '2px'
          })}>Dashboard</NavLink>
          <NavLink to="/about" className="nav-link" style={({ isActive }) => ({
            color: isActive ? '#ff0026' : '#fff',
            textDecoration: 'none',
            fontWeight: 500,
            borderBottom: isActive ? '2px solid #ff0026' : 'none',
            paddingBottom: '2px'
          })}>About</NavLink>
        </div>
      </div>
    </nav>
  );
}

// Luxury card container component
function Card({ children, style }) {
  return (
    <div
      className="lux-card"
      style={{
        background: '#fff',
        borderRadius: 22,
        boxShadow: '0 8px 32px rgba(30,0,50,0.19)',
        padding: '2.3rem 2rem 2.5rem 2rem',
        maxWidth: 500,
        margin: '0 auto',
        width: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// PUBLIC_INTERFACE
function Home() {
  // Landing page with luxury description
  return (
    <div className="center-outer">
      <Card>
        <div className="subtitle" style={{ color: '#3400ff', fontWeight: 700 }}>AI Career Matchmaking</div>
        <h1 className="title" style={{ color: '#ff0026', fontWeight: 700, marginTop: 7, marginBottom: 0, fontSize: '2.8rem' }}>Welcome to LuxMatch Pro</h1>
        <p className="description" style={{ color: '#333', fontSize: '1.18rem', marginTop: 16 }}>
          Discover your dream job and unlock tailored skills for your goals with luxury AI precision.
        </p>
        <NavLink to="/profile">
          <button className="btn btn-large" style={{ background: 'linear-gradient(90deg, #ff0026, #3400ff)', color: "#fff" }}>
            Get Started
          </button>
        </NavLink>
      </Card>
    </div>
  );
}

// PUBLIC_INTERFACE
function Profile({ profile, setProfile, onAnalyze }) {
  // User profile form: name, skills, goals
  const [name, setName] = useState(profile.name || '');
  const [skills, setSkills] = useState(profile.skills ? profile.skills.join(', ') : '');
  const [goals, setGoals] = useState(profile.goals || '');

  function handleSubmit(e) {
    e.preventDefault();
    setProfile({
      name: name.trim(),
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      goals: goals.trim(),
    });
    if (onAnalyze) onAnalyze();
  }
  return (
    <div className="center-outer">
      <Card>
        <div className="subtitle" style={{ color: '#ff0026', textAlign: 'center', marginBottom: 14 }}>Profile Analysis</div>
        <form onSubmit={handleSubmit} autoComplete="off" data-testid="profile-form">
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 500 }}>Full Name</label>
            <input
              style={inputStyle}
              type="text"
              placeholder="e.g. Jane Doe"
              value={name}
              required
              onChange={e => setName(e.target.value)}
              data-testid="profile-name"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 500 }}>Skills (comma separated)</label>
            <input
              style={inputStyle}
              type="text"
              placeholder="e.g. React, CSS, Leadership"
              value={skills}
              required
              onChange={e => setSkills(e.target.value)}
              data-testid="profile-skills"
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 500 }}>Career Goals</label>
            <input
              style={inputStyle}
              type="text"
              placeholder="e.g. Frontend Lead, CTO"
              value={goals}
              required
              onChange={e => setGoals(e.target.value)}
              data-testid="profile-goals"
            />
          </div>
          <button type="submit" className="btn btn-large" style={{
            width: "100%",
            background: "linear-gradient(90deg, #3400ff, #ff0026) ",
            color: "#fff"
          }}>Analyze</button>
        </form>
      </Card>
    </div>
  );
}
const inputStyle = {
  width: '100%',
  padding: '10px 9px',
  fontSize: 16,
  border: '1px solid #eee',
  borderRadius: 8,
  marginTop: 4,
  marginBottom: 2,
  background: '#f7f7fa'
};

// PUBLIC_INTERFACE
function Dashboard({ profile }) {
  // Job matching and skill recommendations based on user's profile
  const jobs = getMatchedJobs(profile);
  const skills = getSkillRecommendations(profile);

  return (
    <div className="center-outer">
      <Card>
        <div className="subtitle" style={{ color: '#ff0026', textAlign: 'center', marginBottom: 4 }}>
          {profile.name ? profile.name + "'s " : ''}Job Dashboard
        </div>
        <h2 style={{ color: '#3400ff', fontWeight: 600, fontSize: '1.4rem', marginBottom: 10, marginTop: 0 }}>Top Matched Jobs</h2>
        {(!profile.skills || profile.skills.length === 0) && (
          <div style={{ color: '#999', fontSize: 15, marginTop: 8, marginBottom: 12 }}>Enter your profile to see recommendations.</div>
        )}
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {jobs.map((job, i) => (
            <li key={i} style={{
              background: 'linear-gradient(90deg, #ff002603, #3400ff07)',
              padding: '8px 14px',
              borderRadius: 10,
              marginBottom: 9,
              fontWeight: 500,
              color: '#222',
              boxShadow: "0 1px 6px #ecebf94f"
            }}>
              <span style={{ color: '#ff0026', fontWeight: 700 }}>{job.title}</span>
              <span style={{ fontWeight: 500, color: "#3400ff", float: 'right' }}>{job.company}</span>
              <div style={{ fontSize: 13, color: '#444', marginTop: 2 }}>{job.summary}</div>
            </li>
          ))}
        </ul>
        <h2 style={{ color: '#3400ff', fontWeight: 600, fontSize: '1.1rem', marginTop: 30, marginBottom: 13 }}>Recommended Skills</h2>
        <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {skills.map(s =>
            <li key={s} style={{
              background: 'linear-gradient(90deg, #ff0026 44%, #3400ff 100%)',
              color: "#fff",
              borderRadius: 8,
              padding: '4px 14px',
              fontSize: '1rem',
              fontWeight: 500,
              boxShadow: '0 2px 6px #ff002623',
              marginBottom: 4
            }}>{s}</li>
          )}
        </ul>
      </Card>
    </div>
  );
}

// PUBLIC_INTERFACE
function About() {
  return (
    <div className="center-outer">
      <Card>
        <div className="subtitle" style={{ color: '#3400ff', textAlign: 'center', marginBottom: 12 }}>About LuxMatch Pro</div>
        <div style={{ color: '#333', fontSize: 16, marginBottom: 16 }}>
          <b>LuxMatch Pro</b> is your personalized AI career assistant, matching your profile with top jobs and tailored skills to boost your journey!
        </div>
        <ul style={{ color: "#444", fontSize: 15, marginTop: 0, marginBottom: 16, listStyle: 'disc inside' }}>
          <li>Seamless navigation & luxury card UI.</li>
          <li>Mock data for job and skill recommendations.</li>
          <li>State managed with <code>useState</code>; no backend—privacy-focused.</li>
          <li>Responsive design: looks great on mobile & desktop.</li>
        </ul>
        <div style={{ color: '#3400ff' }}>
          &copy; 2024 LuxMatch Pro. All rights reserved.
        </div>
      </Card>
    </div>
  );
}

// PUBLIC_INTERFACE
function NotFound() {
  // Fallback for unmatched routes
  return (
    <div className="center-outer">
      <Card>
        <div style={{ textAlign: 'center', color: '#ff0026', fontWeight: 700, fontSize: 28 }}>404</div>
        <span style={{ color: '#3400ff' }}>Page Not Found.</span>
      </Card>
    </div>
  );
}

// -- Mock Job Matching & Skill Recommendation Logic --
// PUBLIC_INTERFACE
function getMatchedJobs(profile) {
  // Returns top 2 job matches from mock data based on input skills/goals
  if (!profile || !profile.skills || profile.skills.length === 0) return [];
  const availableJobs = [
    {
      title: "Frontend Engineer",
      company: "LuxuryTech Inc.",
      tags: ["React", "UI", "JavaScript"],
      summary: "Build luxury interfaces using React and CSS wizardry. Growth-focused culture.",
    },
    {
      title: "AI Product Manager",
      company: "Futura Luxe",
      tags: ["Product", "AI", "Leadership"],
      summary: "Lead the roadmap on next-gen AI tools for career advancement.",
    },
    {
      title: "Backend Developer",
      company: "Platinum Logic",
      tags: ["Node.js", "APIs", "Cloud"],
      summary: "Design high-end scalable backends for premium experiences.",
    },
    {
      title: "UX Designer",
      company: "Spark Design House",
      tags: ["Design", "Figma", "UX"],
      summary: "Shape luxury digital journeys with your creative prowess.",
    },
  ];

  // Match user skills to job tags naively, rank higher #matches
  const skillset = profile.skills.map(s => s.toLowerCase());
  let sorted = [...availableJobs].sort((jA, jB) => {
    const jAMatch = jA.tags.filter(tag => skillset.includes(tag.toLowerCase())).length;
    const jBMatch = jB.tags.filter(tag => skillset.includes(tag.toLowerCase())).length;
    return jBMatch - jAMatch;
  });
  return sorted.slice(0, 2);
}

// PUBLIC_INTERFACE
function getSkillRecommendations(profile) {
  // 5 unique recommended skills based on goals/skills (mock logic)
  const universalSkills = [
    "Communication",
    "Teamwork",
    "Problem Solving",
    "Adaptability",
    "Leadership",
    "Time Management",
    "React",
    "Node.js",
    "Figma",
    "Cloud",
    "TypeScript",
    "Machine Learning",
    "Product Sense"
  ];
  if (!profile || !profile.skills) return universalSkills.slice(0, 5);
  const skillsSet = new Set(profile.skills.map(s => s.trim().toLowerCase()));
  const recommended = [];
  // Tailor the recs if goal contains word
  if (profile.goals.toLowerCase().includes("lead")) {
    recommended.push("Leadership", "Product Roadmapping");
  }
  // Recommend any skills missing from universal
  for (const s of universalSkills) {
    if (!skillsSet.has(s.toLowerCase()) && recommended.length < 5) {
      recommended.push(s);
    }
  }
  // Pad up to 5
  while (recommended.length < 5) recommended.push(universalSkills[(Math.random()*universalSkills.length)|0]);
  return [...new Set(recommended)].slice(0, 5);
}

// --- Main App ---
// PUBLIC_INTERFACE
function App() {
  // Global state: user profile: { name, skills:[], goals }
  const [profile, setProfile] = useState({ name: '', skills: [], goals: '' });

  // For submission flow: if profile updated, auto-navigate dashboard
  const [analyzeRedirect, setAnalyzeRedirect] = useState(false);

  // Background: Gradient, covers whole viewport, padding for navbar (60px)
  return (
    <Router>
      <div 
        className="app" 
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #ff0026 0%, #3400ff 100%)",
          paddingTop: 72,
          boxSizing: "border-box",
          position: "relative"
        }}
      >
        <Navbar />
        <main>
          <div className="main-container" style={{
            minHeight: "calc(100vh - 80px)",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={
                <Profile
                  profile={profile}
                  setProfile={setProfile}
                  onAnalyze={() => setAnalyzeRedirect(true)}
                />
              } />
              <Route path="/dashboard" element={
                profile.skills && profile.skills.length > 0
                  ? <Dashboard profile={profile} />
                  : <Navigate to="/profile" replace />
              } />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* Redirect to Dashboard after profile analysis submit */}
            {analyzeRedirect && <Navigate to="/dashboard" replace />}
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
