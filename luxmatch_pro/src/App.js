import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

// PUBLIC_INTERFACE
function Navbar() {
  return (
    <nav className="navbar lux-navbar">
      <div className="container navbar-flex">
        <div className="logo">
          <span className="logo-symbol" role="img" aria-label="luxury">★</span> LuxMatch <span style={{color: "#ff0026"}}>Pro</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/profile" className="nav-link">Profile</Link></li>
          <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
          <li><Link to="/about" className="nav-link">About</Link></li>
        </ul>
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function Home() {
  return (
    <section className="lux-section">
      <div className="lux-card home-card">
        <h1 className="lux-title gradient-text">Welcome to LuxMatch Pro</h1>
        <p className="lux-desc">
          The luxury job-matching platform that helps you reach your career goals. Analyze your profile, discover tailored job opportunities, and receive skill recommendations to unlock your full potential.
        </p>
        <Link to="/profile">
          <button className="btn btn-large primary-btn">Get Started</button>
        </Link>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function ProfileForm({ profile, setProfile, onSubmit }) {
  // For comma-separated skills, store as array
  const [local, setLocal] = useState(profile);

  function handleChange(e) {
    const { name, value } = e.target;
    setLocal((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  function handleSkillsChange(e) {
    setLocal((prev) => ({
      ...prev,
      skills: e.target.value,
    }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    // Split skills into array and trim whitespace
    setProfile({
      ...local,
      skills: local.skills.split(',').map((s) => s.trim()).filter((s) => s)
    });
    if (onSubmit) onSubmit();
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit} autoComplete="off">
      <h2>Profile Analysis</h2>
      <label>
        Name
        <input
          type="text"
          name="name"
          value={local.name}
          onChange={handleChange}
          required
          placeholder="Alice Smith"
        />
      </label>
      <label>
        Role
        <input
          type="text"
          name="role"
          value={local.role}
          onChange={handleChange}
          required
          placeholder="e.g. Data Scientist"
        />
      </label>
      <label>
        Domain
        <input
          type="text"
          name="domain"
          value={local.domain}
          onChange={handleChange}
          required
          placeholder="e.g. Finance, Healthcare"
        />
      </label>
      <label>
        Skills (comma separated)
        <input
          type="text"
          name="skills"
          value={local.skills}
          onChange={handleSkillsChange}
          required
          placeholder="e.g. Python, Machine Learning, SQL"
        />
      </label>
      <label>
        Career Goals
        <input
          type="text"
          name="careerGoals"
          value={local.careerGoals}
          onChange={handleChange}
          required
          placeholder="e.g. Become Lead Data Scientist"
        />
      </label>
      <button className="btn primary-btn" type="submit">Analyze</button>
    </form>
  );
}

// PUBLIC_INTERFACE
function Profile({ profile, setProfile }) {
  const navigate = useNavigate();

  function handleSubmit() {
    // Optionally add logic before navigation
    navigate('/dashboard');
  }
  return (
    <section className="lux-section">
      <div className="lux-card profile-card">
        <ProfileForm profile={profile} setProfile={setProfile} onSubmit={handleSubmit} />
      </div>
    </section>
  );
}

// Returns mock jobs based on user fields
function getMockJobs({ skills, role, domain, careerGoals }) {
  // Heuristic: match top 2 jobs containing overlap in role, skills, or domain
  const JOBS = [
    {
      title: 'Lead Data Scientist',
      company: 'DiamondQuant',
      domain: 'Finance',
      matchScore: 0,
      tags: ['Python', 'Machine Learning', 'Finance', 'Leadership'],
      description: 'Drive ML projects in quantitative finance. High-impact, luxury workspace.'
    },
    {
      title: 'AI Product Manager',
      company: 'LuxAI Innovations',
      domain: 'Technology',
      matchScore: 0,
      tags: ['Product', 'AI', 'Strategy'],
      description: 'Shape the AI products of tomorrow in a premium tech team.'
    },
    {
      title: 'Senior Backend Engineer',
      company: 'GoldLeaf Health',
      domain: 'Healthcare',
      matchScore: 0,
      tags: ['Node.js', 'APIs', 'Healthcare', 'Cloud'],
      description: 'Architect secure systems for health data in a global company.'
    },
    {
      title: 'CTO, Machine Learning',
      company: 'Visionary Startups',
      domain: 'Technology',
      matchScore: 0,
      tags: ['Leadership', 'ML', 'Startups'],
      description: 'Technical executive role in fast-growing AI startup.'
    }
  ];
  // Calculate match scores
  let results = JOBS.map(job => {
    let score =
      (role && job.title.toLowerCase().includes(role.toLowerCase()) ? 2 : 0) +
      (domain && job.domain.toLowerCase().includes(domain.toLowerCase()) ? 1.5 : 0) +
      (skills && job.tags.filter(t => skills.map(s => s.toLowerCase()).includes(t.toLowerCase())).length) +
      (careerGoals && job.title.toLowerCase().includes(careerGoals.toLowerCase()) ? 1 : 0);
    return { ...job, matchScore: score };
  });
  results.sort((a, b) => b.matchScore - a.matchScore);
  return results.slice(0, 2);
}

// Returns mock skills to upskill tailored to user
function getMockSkills({ skills, domain, role }) {
  const allRecommendations = [
    { skill: 'Deep Learning', match: vmatch('deep learning') },
    { skill: 'Natural Language Processing', match: vmatch('nlp') },
    { skill: 'Financial Modeling', match: domain && domain.toLowerCase().includes('finance') },
    { skill: 'Healthcare Analytics', match: domain && domain.toLowerCase().includes('health') },
    { skill: 'Project Management', match: role && role.toLowerCase().includes('manager') },
    { skill: 'Cloud Computing', match: true },
    { skill: 'Leadership', match: true },
    { skill: 'MLOps', match: role && (role.toLowerCase().includes('data') || role.toLowerCase().includes('ml')) },
    { skill: 'TypeScript', match: "front" in (role || "").toLowerCase() },
    { skill: 'Business Strategy', match: true }
  ];
  // Always suggest skills not already in user's skill list
  const userSkills = new Set(skills ? skills.map(s => s.toLowerCase()) : []);
  const skillRecs = allRecommendations
    .filter(rec => !userSkills.has(rec.skill.toLowerCase()) && rec.match)
    .map(rec => rec.skill)
    .slice(0, 5);
  return skillRecs.length ? skillRecs : ['Python', 'Communication', 'Leadership', 'Data Analysis', 'Teamwork'];

  function vmatch(str) { // Vague partial match for simple demo
    return !!(skills && skills.join(' ').toLowerCase().includes(str));
  }
}

// PUBLIC_INTERFACE
function Dashboard({ profile }) {
  const hasProfile = profile.name && profile.skills && profile.role && profile.domain && profile.careerGoals;
  const jobs = hasProfile ? getMockJobs(profile) : [];
  const skillRecs = hasProfile ? getMockSkills(profile) : [];

  return (
    <section className="lux-section">
      <div className="lux-card dashboard-card">
        <h2>Dashboard</h2>
        <div className="dashboard-columns">
          <div className="column jobs-column">
            <h3><span role="img" aria-label="briefcase">💼</span> Top Matched Jobs</h3>
            {jobs.length === 0 ?
              <span className="dashboard-placeholder">No profile data provided.</span> :
              jobs.map((job, idx) => (
                <div key={job.title} className="job-card">
                  <div className="job-title">{job.title} <span className="company">@{job.company}</span></div>
                  <div className="job-tags">{job.tags.map(t => <span className="job-tag" key={t}>{t}</span>)}</div>
                  <div className="job-desc">{job.description}</div>
                </div>
              ))}
          </div>
          <div className="column skills-column">
            <h3><span role="img" aria-label="lightbulb">✨</span> Skill Recommendations</h3>
            {skillRecs.length === 0 ?
              <span className="dashboard-placeholder">No profile data provided.</span> :
              <ul className="skills-list">
                {skillRecs.map(skill => <li key={skill} className="skill-rec">{skill}</li>)}
              </ul>
            }
          </div>
        </div>
        <div className="dashboard-summary">
          <b>Name:</b> {profile.name || '-'}<br />
          <b>Role:</b> {profile.role || '-'}<br />
          <b>Domain:</b> {profile.domain || '-'}<br />
          <b>Skills:</b> {(profile.skills && profile.skills.join(', ')) || '-'}<br />
          <b>Goals:</b> {profile.careerGoals || '-'}
        </div>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function About() {
  return (
    <section className="lux-section">
      <div className="lux-card about-card">
        <h2>About LuxMatch Pro</h2>
        <p>
          LuxMatch Pro is a cutting-edge job matching and upskilling platform built for modern professionals. By analyzing your profile, our platform delivers high-quality opportunities and actionable skill suggestions, ensuring your career path shines as bright as your ambitions.
        </p>
        <p>
          <b>Technologies:</b> React, Responsive CSS, Mock Data
        </p>
        <p>
          <b>Luxury Color Palette:</b><br />
          <span className="color-swatch" style={{background: '#ff0026'}}></span> #ff0026 (Primary)<br />
          <span className="color-swatch" style={{background: '#3400ff'}}></span> #3400ff (Secondary)<br />
          <span className="color-swatch" style={{background: '#fff', border: '1px solid #ccc'}}></span> #fff (Accent)
        </p>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Central profile state
  const [profile, setProfile] = useState({
    name: '',
    role: '',
    domain: '',
    skills: '',
    careerGoals: ''
  });

  // Maintain skills as array for computation, string for form representation
  // After submit, profile.skills is array

  return (
    <Router>
      <div className="lux-bg">
        <Navbar />
        <main className="lux-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile profile={profile} setProfile={setProfile} />} />
            <Route path="/dashboard" element={
              <Dashboard profile={{
                ...profile,
                skills: Array.isArray(profile.skills) ? profile.skills : profile.skills.split(',').map(s => s.trim()).filter(Boolean)
              }} />
            } />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
