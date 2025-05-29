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

/**
 * PUBLIC_INTERFACE
 * Enhanced DashboardPage with improved skill analysis & recommendation logic.
 * Skill suggestions and job matching use simple heuristics based on goals, synonyms, and missing strengths.
 */
function DashboardPage({ userProfile }) {
  // --- Static Job Catalog ---
  const jobs = [
    {
      title: "AI Product Manager",
      skills: ['Product Management', 'AI Strategy', 'Communication', 'Leadership', 'Python', 'Technical Writing', 'Business Analysis'],
      desc: "Drive development of cutting-edge AI products. Requires tech and business skills.",
      tags: ['management', 'ai', 'software', 'product'],
    },
    {
      title: "Luxury Brand Digital Marketer",
      skills: ['Marketing', 'Branding', 'Creativity', 'Social Media', 'Storytelling', 'Analytics', 'SEO'],
      desc: "Promote luxury brands with advanced digital strategies and creative storytelling.",
      tags: ['marketing', 'brand', 'media', 'creative'],
    },
    {
      title: "Data Scientist",
      skills: ['Python', 'ML', 'Data Analysis', 'Statistics', 'Critical Thinking', 'Visualization', 'SQL'],
      desc: "Use advanced analytics to deliver business insights for high-end clientele.",
      tags: ['data', 'science', 'analytics', 'ml'],
    },
    {
      title: "Customer Experience Lead",
      skills: ['Empathy', 'Customer Service', 'CRM', 'Analytics', 'Leadership', 'Conflict Resolution', 'Operations'],
      desc: "Enhance luxury customer journeys with top-tier service and strategic improvements.",
      tags: ['customer', 'experience', 'service'],
    }
  ];

  // Synonyms dictionary for skill & goal heuristics
  const skillSynonyms = {
    "product manager": ["Product Management", "Product Strategy", "Roadmap", "Technical Writing"],
    "ai": ["AI Strategy", "Python", "ML", "Neural Networks"],
    "marketing": ["Marketing", "Branding", "SEO", "Storytelling", "Digital Strategy"],
    "data": ["Data Analysis", "Statistics", "ML", "Python", "Data Visualization"],
    "customer": ["Customer Service", "Empathy", "CRM", "Relationship Management", "Communication"],
    "manager": ["Leadership", "Operations", "Business Analysis"],
    "creative": ["Creativity", "Storytelling", "Design", "Branding"],
    "digital": ["Digital Strategy", "SEO", "Social Media", "Analytics"],
    "strategy": ["AI Strategy", "Business Analysis", "Product Strategy", "Digital Strategy"],
    "lead": ["Leadership", "Mentorship", "Team Management"],
    // Add more if desired
  };

  // Heuristic: boost score if job matches explicit parts of career goals or synonyms for target role
  function jobMatchScore(job, goals, userSkills) {
    let score = 0;
    const jobSkillsSet = new Set(job.skills.map(s => s.toLowerCase()));
    const userSkillsSet = new Set(userSkills.map(s => s.toLowerCase()));
    // base: intersection of skills
    for (let skill of userSkillsSet) {
      if (jobSkillsSet.has(skill)) score += 1;
    }
    // goal-to-job heuristics boost
    if (goals) {
      // Fuzzy tags and synonyms
      let g = goals.toLowerCase();
      for (let tag of (job.tags || [])) {
        if (g.includes(tag)) score += 2;
      }
      // Synonymic boost
      for (let key in skillSynonyms) {
        if (g.includes(key)) {
          for (let recSkill of skillSynonyms[key]) {
            if (jobSkillsSet.has(recSkill.toLowerCase())) {
              score += 1.2; // partial but less than direct tag
            }
          }
        }
      }
    }
    return score;
  }

  // PUBLIC_INTERFACE
  function recommendSkills(userSkills, goals) {
    // Start with missing skills from best-matching jobs
    const userSet = new Set((userSkills || []).map(s => s.toLowerCase()));
    let recommendations = [];

    // Optionally guess target skills via goal-noun analysis/synonyms
    let goalTerms = (goals || '').toLowerCase().split(/[\s,.;:!?]+/);
    let goalSkillCandidates = [];
    for (let t of goalTerms) {
      for (let [phrase, skills] of Object.entries(skillSynonyms)) {
        if (t && (t === phrase || phrase.includes(t) || t.includes(phrase))) {
          for (let s of skills) {
            if (!userSet.has(s.toLowerCase())) {
              goalSkillCandidates.push(s);
            }
          }
        }
      }
    }

    // Best 2 matched jobs (using improved heuristics and user's profile)
    const scoredJobs = jobs.map(j => ({ ...j, score: jobMatchScore(j, goals, userSkills || []) }));
    scoredJobs.sort((a, b) => b.score - a.score);

    // Gather missing skills from top 2 jobs, prioritize those found in both
    let extraSkills = {};
    let considered = 0;
    for (let job of scoredJobs.slice(0, 2)) {
      for (let s of job.skills) {
        const key = s.toLowerCase();
        if (!userSet.has(key)) {
          extraSkills[key] = (extraSkills[key] || 0) + 1;
        }
      }
      considered++;
    }
    // Convert to sorted array (most frequently recommended skills first)
    let sortedExtra = Object.entries(extraSkills)
      .sort((a, b) => b[1] - a[1])
      .map(([skill]) => {
        // Restore case
        for (let job of jobs) {
          for (let ss of job.skills) {
            if (ss.toLowerCase() === skill) return ss;
          }
        }
        return skill; // fallback, lowercase
      });

    // Merge in goal-based suggestions first, then high-priority job-suggested
    for (let gs of goalSkillCandidates) {
      if (!recommendations.includes(gs)) recommendations.push(gs);
    }
    for (let ex of sortedExtra) {
      if (!recommendations.includes(ex)) recommendations.push(ex);
    }
    // Remove duplicates
    recommendations = Array.from(new Set(recommendations));
    return recommendations.slice(0, 5);
  }

  // Map jobs with their enhanced scores
  const jobScores = jobs.map(j =>
    ({ ...j, score: jobMatchScore(j, userProfile.goals, userProfile.skills || []) })
  );
  jobScores.sort((a, b) => b.score - a.score);
  const matchedJobs = jobScores.slice(0, 2);

  // Recommendations
  const skillRecommendations = recommendSkills(userProfile?.skills || [], userProfile?.goals || '');

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
                    Match Score: <b>{job.score.toFixed(1)}</b>
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
