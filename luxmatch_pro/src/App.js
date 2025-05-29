import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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

/**
 * PUBLIC_INTERFACE
 * ProfilePage: User profile entry page for name, skills, career goals.
 * Handles input and submits to main app state and navigates to dashboard.
 */
function ProfilePage({ userProfile, onProfileSubmit }) {
  // State for each field, with default to passed userProfile prop values
  const [name, setName] = useState(userProfile.name || '');
  const [skills, setSkills] = useState(
    Array.isArray(userProfile.skills)
      ? userProfile.skills.join(', ')
      : (userProfile.skills || '')
  );
  const [goals, setGoals] = useState(userProfile.goals || '');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !skills.trim() || !goals.trim()) {
      setError('Please complete all fields.');
      return;
    }
    setError('');
    // Parse skills as trimmed array, filter empty
    const parsedSkills = skills.split(',')
      .map(s => s.trim())
      .filter(Boolean);
    onProfileSubmit({ name, skills: parsedSkills, goals });
    // Go to dashboard programmatically after storing state
    navigate('/dashboard');
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
 * DashboardPage: Displays top job matches and personalized recommendations for the user.
 * Matching is based on analyzed skills/career goals with mock data.
 */
function DashboardPage({ userProfile }) {
  // Curated job mock data
  const jobs = [
    {
      title: "AI Product Manager",
      skills: ["Product Management", "AI Strategy", "Communication", "Leadership", "Python", "Technical Writing", "Business Analysis"],
      desc: "Drive development of cutting-edge AI products. Requires tech and business skills.",
      tags: ["management", "ai", "software", "product"],
    },
    {
      title: "Luxury Brand Digital Marketer",
      skills: ["Marketing", "Branding", "Creativity", "Social Media", "Storytelling", "Analytics", "SEO"],
      desc: "Promote luxury brands with advanced digital strategies and creative storytelling.",
      tags: ["marketing", "brand", "media", "creative"],
    },
    {
      title: "Data Scientist",
      skills: ["Python", "ML", "Data Analysis", "Statistics", "Critical Thinking", "Visualization", "SQL"],
      desc: "Use advanced analytics to deliver business insights for high-end clientele.",
      tags: ["data", "science", "analytics", "ml"],
    },
    {
      title: "Customer Experience Lead",
      skills: ["Empathy", "Customer Service", "CRM", "Analytics", "Leadership", "Conflict Resolution", "Operations"],
      desc: "Enhance luxury customer journeys with top-tier service and strategic improvements.",
      tags: ["customer", "experience", "service"],
    }
  ];

  // Basic synonyms for boosting score if career goal matches
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
  };

  // Returns a match score and whyText for a job given user profile
  function jobMatchScoreWithExplanation(job, goals, userSkillsArr) {
    let score = 0;
    let explanations = [];
    const userSkillsLower = (userSkillsArr || []).map(s => s.toLowerCase().trim());
    const jobSkillsLower = job.skills.map(s => s.toLowerCase().trim());

    // Skill match: direct overlap
    let overlapSkills = userSkillsLower.filter(s => jobSkillsLower.includes(s));
    if (overlapSkills.length > 0) {
      score += overlapSkills.length;
      explanations.push(`Direct skill match: ${overlapSkills.map(s => capitalizeSkill(s)).join(', ')}.`);
    }

    // Career goal tag boosts
    if (goals && typeof goals === "string" && goals.length > 0) {
      let g = goals.toLowerCase();
      let goalTagsMatched = [];
      for (let tag of (job.tags || [])) {
        if (g.includes(tag)) {
          score += 2;
          goalTagsMatched.push(tag);
        }
      }
      if (goalTagsMatched.length)
        explanations.push(`Matched to your goal keywords: ${goalTagsMatched.join(', ')}.`);
    }

    // Synonym phrase boosts (from skillSynonyms)
    if (goals && typeof goals === "string" && goals.length > 0) {
      let g = goals.toLowerCase();
      let matchedSynonyms = [];
      for (let key in skillSynonyms) {
        if (g.includes(key)) {
          let keyHits = [];
          for (let syn of skillSynonyms[key]) {
            if (jobSkillsLower.includes(syn.toLowerCase())) {
              score += 1.2;
              keyHits.push(syn);
            }
          }
          if (keyHits.length > 0)
            matchedSynonyms.push(...keyHits);
        }
      }
      if (matchedSynonyms.length)
        explanations.push(`Related to your goal (“${matchedSynonyms.join(', ')}”).`);
    }

    // If no skills matched, fallback explanation
    if (score === 0) {
      explanations.push("No direct match, but this job is featured as a top market role.");
    }

    return {
      score,
      why: explanations.join(" ")
    };
  }

  // Capitalize skill names from lowercased form
  function capitalizeSkill(skill) {
    // Match from jobs for accurate case, else capitalize
    for (const j of jobs) {
      for (const s of j.skills) {
        if (s.toLowerCase() === skill) return s;
      }
    }
    return skill.charAt(0).toUpperCase() + skill.slice(1);
  }

  // Get top matches with explanations
  function getTopMatchingJobs(userProfile) {
    const { skills = [], goals = '' } = userProfile;
    let jobScores = jobs.map(job => {
      const { score, why } = jobMatchScoreWithExplanation(job, goals, skills);
      return { ...job, score, why };
    });
    jobScores.sort((a, b) => b.score - a.score);

    // Only show jobs with nonzero score if available
    let nonzero = jobScores.filter(j => j.score > 0);
    return (nonzero.length >= 2 ? nonzero.slice(0, 2) : jobScores.slice(0, 2));
  }

  // Recommend missing skills from top jobs not in user profile
  function recommendSkills(userProfile) {
    const userSkillsLower = (userProfile.skills || []).map(s => s.toLowerCase());
    let topJobs = getTopMatchingJobs(userProfile);

    // Gather all missing skills from both jobs, prioritized if missing in profile and in both jobs
    let missingSkillCounts = {};
    for (let job of topJobs) {
      for (let s of job.skills) {
        let sLower = s.toLowerCase();
        if (!userSkillsLower.includes(sLower)) {
          missingSkillCounts[s] = (missingSkillCounts[s] || 0) + 1;
        }
      }
    }
    // Sorted: skills missing from both jobs (2), then 1, then alphabetically
    let recs = Object.entries(missingSkillCounts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([s]) => s);

    // Additional: parse goals for possible relevant skills
    const goalTerms = ((userProfile.goals || '').toLowerCase().match(/\w+/g) || []);
    let fromGoal = [];
    for (let t of goalTerms) {
      for (const [phrase, skills] of Object.entries(skillSynonyms)) {
        if (t && (t === phrase || phrase.includes(t) || t.includes(phrase))) {
          for (const s of skills) {
            if (!userSkillsLower.includes(s.toLowerCase()) && !recs.includes(s)) {
              fromGoal.push(s);
            }
          }
        }
      }
    }
    // Combine and dedupe, goal recs first
    let unique = Array.from(new Set([...fromGoal, ...recs]));
    return unique.slice(0, 5);
  }

  // Rendering
  const validProfile =
    userProfile.name &&
    Array.isArray(userProfile.skills) && userProfile.skills.length > 0 &&
    userProfile.goals;

  const topMatches = getTopMatchingJobs(userProfile);
  const skillRecs = recommendSkills(userProfile);

  return (
    <div className="lux-card-center">
      <div className="lux-card">
        <div className="lux-card-title">Your Match Results</div>
        {!validProfile ? (
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
              {topMatches.map((job, idx) => (
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
                    Match Score: <b>{job.score.toFixed(1)}</b><br />
                    <span className="lux-small-text">{job.why}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="lux-section-title">Recommended Skills to Add</div>
            <div className="lux-skill-recs">
              {skillRecs.length ? skillRecs.map((s, k) =>
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

  // Handler for updating profile.
  function handleProfileSubmit(profile) {
    setUserProfile(profile);
    // Navigation will be handled in ProfilePage with useNavigate after setting state!
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
