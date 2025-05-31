import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import './App.css';

// PUBLIC_INTERFACE
function LuxNavBar() {
  return (
    <nav className="lux-navbar">
      <div className="lux-navbar-inner">
        <div className="lux-logo">
          <span className="lux-logo-symbol">★</span>
          <span className="lux-logo-text">LuxMatch <span className="lux-pro">Pro</span></span>
        </div>
        <div className="lux-nav-links">
          <NavLink to="/" className="lux-nav-link" end>Home</NavLink>
          <NavLink to="/profile" className="lux-nav-link">Profile</NavLink>
          <NavLink to="/dashboard" className="lux-nav-link">Dashboard</NavLink>
          <NavLink to="/about" className="lux-nav-link">About</NavLink>
        </div>
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function Home() {
  return (
    <section className="lux-maincard">
      <div className="lux-hero">
        <div className="lux-title">
          Welcome to <span className="lux-pro">LuxMatch Pro</span>
        </div>
        <div className="lux-subtitle">Your pathway to luxury careers and personalized growth.</div>
        <div className="lux-desc">
          Discover top job matches and skill recommendations tailored to your profile. 
          Enjoy a refined experience, luxury styling, and smart career insights.
        </div>
        <NavLink to="/profile">
          <button className="lux-btn lux-btn-large">Get Started</button>
        </NavLink>
      </div>
    </section>
  );
}

// Utility: mock job and skill recommendation logic
function getMockJobs(skills = [], careerGoal = '') {
  // Pretend jobs dataset
  const allJobs = [
    { title: 'Senior Product Designer', skills: ['UX', 'Figma', 'Collaboration'] },
    { title: 'AI Software Engineer', skills: ['Python', 'Machine Learning', 'Data Analysis'] },
    { title: 'Growth Marketing Manager', skills: ['Marketing', 'Strategy', 'Analytics'] },
    { title: 'Full Stack Developer', skills: ['React', 'Node.js', 'APIs'] },
    { title: 'Venture Analyst', skills: ['Finance', 'Startups', 'Research'] },
  ];
  // Simple rank by shared skill count + career goal match
  const ranked = allJobs
    .map(job => ({
      ...job,
      score: (job.skills.filter(sk => skills.includes(sk)).length)
        + (careerGoal && job.title.toLowerCase().includes(careerGoal.toLowerCase()) ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score);
  return ranked.slice(0, 2);
}

function getMockSkills(skills = [], jobs = []) {
  // Pool of skills for demo - in real case, would depend on jobs
  const recommended = [
    'Python', 'Machine Learning', 'Data Analysis', 'Leadership', 'Figma',
    'UI/UX Design', 'React', 'Cloud Computing', 'AI', 'Strategic Planning',
    'Collaboration', 'Communication', 'Project Management',
  ];
  // Exclude already selected skills
  // (and try to suggest things relevant to selected jobs)
  const topSkills = recommended
    .filter(skill =>
      !skills.includes(skill) &&
      jobs.some(job => job.skills.includes(skill))
    )
    .slice(0, 5);
  // If less than 5, fill from rest
  if (topSkills.length < 5) {
    const fillers = recommended.filter(sk => !skills.includes(sk) && !topSkills.includes(sk));
    return topSkills.concat(fillers.slice(0, 5 - topSkills.length));
  }
  return topSkills;
}

// PUBLIC_INTERFACE
function ProfileAnalysis({ profileData, setProfileData, onSubmit }) {
  const [form, setForm] = useState({ name: profileData.name || '', skills: profileData.skills || '', goal: profileData.goal || '' });
  const [err, setErr] = useState('');

  // PUBLIC_INTERFACE
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.skills.trim() || !form.goal.trim()) {
      setErr('Please complete all fields.');
      return;
    }
    setErr('');
    setProfileData({
      ...form,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      goal: form.goal,
    });
    onSubmit();
  }

  return (
    <section className="lux-maincard lux-formcard">
      <h2 className="lux-section-title">Profile Analysis</h2>
      <form className="lux-form" onSubmit={handleSubmit} autoComplete="off">
        <label className="lux-label">
          Full Name
          <input
            className="lux-input"
            type="text"
            name="name"
            placeholder="e.g. Serena Worthington"
            value={form.name}
            onChange={handleChange}
            autoFocus
          />
        </label>
        <label className="lux-label">
          Your Key Skills <span className="lux-hint">(comma separated)</span>
          <input
            className="lux-input"
            type="text"
            name="skills"
            placeholder="e.g. Python, Data Analysis, Figma"
            value={form.skills}
            onChange={handleChange}
          />
        </label>
        <label className="lux-label">
          Target Job Title or Career Goal
          <input
            className="lux-input"
            type="text"
            name="goal"
            placeholder="e.g. Full Stack Developer"
            value={form.goal}
            onChange={handleChange}
          />
        </label>
        {err && <div className="lux-error">{err}</div>}
        <button className="lux-btn lux-btn-large" type="submit">Analyze My Profile</button>
      </form>
    </section>
  );
}

// PUBLIC_INTERFACE
function Dashboard({ profileData }) {
  if (!profileData.name || !profileData.skills?.length || !profileData.goal) {
    return (
      <section className="lux-maincard">
        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <div className="lux-msg">You haven't analyzed your profile yet.</div>
          <NavLink to="/profile"><button className="lux-btn" style={{marginTop: 16}}>Go to Profile Analysis</button></NavLink>
        </div>
      </section>
    );
  }
  // Calculate results
  const matchedJobs = getMockJobs(profileData.skills, profileData.goal);
  const skillRecs = getMockSkills(profileData.skills, matchedJobs);

  return (
    <section className="lux-maincard">
      <h2 className="lux-section-title">{profileData.name.split(' ')[0]}'s Personalized Dashboard</h2>
      <div className="lux-dash-columns">
        <div className="lux-dash-card">
          <div className="lux-dash-title">Top Matched Jobs</div>
          <ul className="lux-job-list">
            {matchedJobs.map((job, i) => (
              <li key={i}><span className="lux-job-title">{job.title}</span></li>
            ))}
          </ul>
        </div>
        <div className="lux-dash-card">
          <div className="lux-dash-title">Recommended Skills to Excel</div>
          <ul className="lux-skill-list">
            {skillRecs.map((skill, i) => (<li key={i}>{skill}</li>))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function About() {
  return (
    <section className="lux-maincard">
      <h2 className="lux-section-title">About LuxMatch Pro</h2>
      <div className="lux-desc" style={{textAlign: 'justify'}}>
        LuxMatch Pro provides a luxury-class user experience, state-of-the-art job matching, and actionable skill recommendations for career enthusiasts. Built with React and advanced UI concepts, it empowers you to navigate your career journey with grace and confidence.
        <br/><br/>
        <b>Technologies:</b> React, react-router-dom, CSS Flexbox/Grid, ES6+.
      </div>
      <div className="lux-muted" style={{marginTop: 16, fontSize: '0.95rem'}}>
        &copy; {new Date().getFullYear()} LuxMatch Pro. All Rights Reserved.
      </div>
    </section>
  );
}

// Top-level App
// PUBLIC_INTERFACE
function App() {
  const [profileData, setProfileData] = useState({ name: '', skills: [], goal: '' });
  const navigate = useNavigate();
  function gotoDashboard() {
    navigate('/dashboard');
  }

  // Linear gradient, card centered, nav at top (with content padding)
  return (
    <div className="lux-app-bg">
      <LuxNavBar />
      <div className="lux-content-area">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={
            <ProfileAnalysis
              profileData={profileData}
              setProfileData={setProfileData}
              onSubmit={gotoDashboard}
            />} />
          <Route path="/dashboard" element={<Dashboard profileData={profileData} />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={
            <section className="lux-maincard">
              <div style={{textAlign: 'center',minHeight:'160px'}}><b>404</b> – Page not found</div>
            </section>
          } />
        </Routes>
      </div>
    </div>
  );
}

// Router wrapper
// PUBLIC_INTERFACE
export default function LuxMatchProContainer() {
  return (
    <Router>
      <App />
    </Router>
  );
}
