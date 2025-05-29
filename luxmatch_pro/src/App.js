import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// PUBLIC_INTERFACE
function LuxNavbar() {
  return (
    <nav className="lux-navbar">
      <div className="lux-navbar-content">
        <span className="lux-logo"><span className="lux-logo-symbol">*</span> LuxMatch <span className="lux-pro">Pro</span></span>
        <div className="lux-navlinks">
          <a href="/" className="lux-link">Home</a>
          <a href="/profile" className="lux-link">Profile</a>
          <a href="/dashboard" className="lux-link">Dashboard</a>
          <a href="/about" className="lux-link">About</a>
        </div>
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function HomePage() {
  return (
    <div className="lux-card-center">
      <div className="lux-card">
        <div className="lux-card-title">Welcome to LuxMatch Pro</div>
        <div className="lux-card-desc">Experience smart job matches and skill recommendations, powered by your unique profile. Get started by visiting the Profile page and let LuxMatch Pro analyze your talents and ambitions!</div>
        <a href="/profile" className="lux-btn lux-btn-primary">Analyze My Profile</a>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function ProfilePage({ userProfile, onProfileSubmit }) {
  const [name, setName] = useState(userProfile.name || '');
  const [skills, setSkills] = useState(userProfile.skills || '');
  const [goals, setGoals] = useState(userProfile.goals || '');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !skills.trim() || !goals.trim()) {
      setError('Please complete all fields.');
      return;
    }
    setError('');
    const parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
    onProfileSubmit({ name, skills: parsedSkills, goals });
  }

  return (
    <div className="lux-card-center">
      <div className="lux-card">
        <div className="lux-card-title">Profile Analysis</div>
        <form className="lux-profile-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              className="lux-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="off"
            />
          </label>
          <label>
            Your Skills
            <input
              className="lux-input"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="e.g., JavaScript, Sales, Machine Learning"
              autoComplete="off"
            />
            <span className="lux-small-text">Separate skills with commas</span>
          </label>
          <label>
            Career Goals
            <input
              className="lux-input"
              value={goals}
              onChange={e => setGoals(e.target.value)}
              placeholder="e.g., Become a Product Manager"
              autoComplete="off"
            />
          </label>
          {error && <div className="lux-error">{error}</div>}
          <button type="submit" className="lux-btn lux-btn-primary">Analyze</button>
        </form>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function DashboardPage({ userProfile }) {
  // --- Mock data and logic ---
  const jobs = [
    {
      title: "AI Product Manager",
      skills: ['Product Management', 'AI Strategy', 'Communication', 'Leadership', 'Python'],
      matchSkills: ['AI Strategy', 'Product Management', 'Leadership', 'Communication', 'Python'],
      desc: "Drive development of cutting-edge AI products. Requires tech and business skills.",
    },
    {
      title: "Luxury Brand Digital Marketer",
      skills: ['Marketing', 'Branding', 'Creativity', 'Social Media', 'Storytelling'],
      matchSkills: ['Marketing', 'Branding', 'Social Media'],
      desc: "Promote luxury brands with advanced digital strategies and creative storytelling.",
    },
    {
      title: "Data Scientist",
      skills: ['Python', 'ML', 'Data Analysis', 'Statistics', 'Critical Thinking'],
      matchSkills: ['Python', 'ML', 'Data Analysis'],
      desc: "Use advanced analytics to deliver business insights for high-end clientele.",
    },
    {
      title: "Customer Experience Lead",
      skills: ['Empathy', 'Customer Service', 'CRM', 'Analytics', 'Leadership'],
      matchSkills: ['Customer Service', 'Leadership', 'Analytics'],
      desc: "Enhance luxury customer journeys with top-tier service and strategic improvements.",
    }
  ];

  function jobMatchScore(job) {
    let score = 0;
    if (!userProfile || !userProfile.skills) return score;
    for (let skill of userProfile.skills.map(s => s.toLowerCase())) {
      if (job.skills.map(j => j.toLowerCase()).includes(skill)) {
        score += 1;
      }
    }
    if (userProfile.goals && job.title.toLowerCase().includes(userProfile.goals.toLowerCase())) {
      score += 3; // Boost for direct goal match
    }
    return score;
  }

  // Find top 2 jobs that match best
  const jobScores = jobs.map(j => ({ ...j, score: jobMatchScore(j) }));
  jobScores.sort((a, b) => b.score - a.score);
  const matchedJobs = jobScores.slice(0, 2);

  // Skill recommendations: suggest skills from jobs slightly outside current profile
  let currentSkills = userProfile?.skills?.map(s => s.toLowerCase()) || [];
  let skillSet = new Set(currentSkills);
  let extraSkills = [];
  for (let job of matchedJobs) {
    for (let s of job.skills) {
      if (!skillSet.has(s.toLowerCase())) {
        extraSkills.push(s);
      }
    }
  }
  // Ensure skill recs are unique and limit to 5
  const skillRecommendations = Array.from(new Set(extraSkills)).slice(0, 5);

  return (
    <div className="lux-card-center">
      <div className="lux-card">
        <div className="lux-card-title">Your Match Results</div>
        {(!userProfile.name || !userProfile.skills || !userProfile.goals) ? (
          <div>
            <div className="lux-error">No profile data entered yet.
              <br />
              <a href="/profile" className="lux-btn lux-btn-secondary">Enter Profile</a>
            </div>
          </div>
        ) : (
          <>
            <div className="lux-user-meta">
              <b>{userProfile.name}</b> <span className="lux-user-label">(Your Profile)</span><br />
              <span className="lux-user-info">Skills: {userProfile.skills.join(', ')}</span><br />
              <span className="lux-user-info">Goal: {userProfile.goals}</span>
            </div>
            <div className="lux-section-title">Top Job Matches</div>
            <div className="lux-job-matches">
              {matchedJobs.map((job, idx) => (
                <div className="lux-job-card" key={job.title + idx}>
                  <div className="lux-job-title">{job.title}</div>
                  <div className="lux-job-desc">{job.desc}</div>
                  <div className="lux-job-skills">
                    <b>Core Skills: </b>
                    {job.skills.map((s, k) =>
                      <span className="lux-skill-badge" key={s + k}>{s}</span>
                    )}
                  </div>
                  <div className="lux-job-score">
                    Match Score: <b>{job.score}</b>
                  </div>
                </div>
              ))}
            </div>
            <div className="lux-section-title">Recommended Skills to Add</div>
            <div className="lux-skill-recs">
              {skillRecommendations.length ? skillRecommendations.map((s, k) =>
                <span className="lux-skill-rec-badge" key={s + k}>{s}</span>
              ) : <span className="lux-small-text">No recommendations—excellent skill fit!</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function AboutPage() {
  return (
    <div className="lux-card-center">
      <div className="lux-card">
        <div className="lux-card-title">About LuxMatch Pro</div>
        <div className="lux-card-desc">
          <b>LuxMatch Pro</b> helps you discover your unique strengths and receive bespoke job matches with actionable skill recommendations.<br />
          No data is stored; all analysis is instant and local for your privacy.<br /><br />
          Designed with a luxury-inspired look and responsive layout.<br /><br />
          <a href="https://github.com" className="lux-btn lux-btn-secondary" target="_blank" rel="noopener noreferrer">
            View Source on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  const [userProfile, setUserProfile] = useState({
    name: '',
    skills: [],
    goals: ''
  });

  // Handler for updating profile
  function handleProfileSubmit(profile) {
    setUserProfile(profile);
    window.location.href = "/dashboard";
  }

  // The main gradient background and responsive layout
  return (
    <Router>
      <div className="lux-app-bg">
        <LuxNavbar />
        <main className="lux-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage userProfile={userProfile} onProfileSubmit={handleProfileSubmit} />} />
            <Route path="/dashboard" element={<DashboardPage userProfile={userProfile} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
