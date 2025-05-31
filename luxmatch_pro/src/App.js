import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import "./App.css";

/* ----------- Mock Data and Matching Logic ---------- */
const MOCK_JOBS = [
  {
    title: "Luxury Brand Analyst",
    description: "Analyze luxury market trends for major brands.",
    skills: ["market research", "data analysis", "luxury branding"],
  },
  {
    title: "VIP Client Relationship Manager",
    description: "Manage VIP client portfolios and exceed sales goals.",
    skills: ["communication", "relationship management", "sales"],
  },
  {
    title: "Elite Event Coordinator",
    description: "Plan high-profile events for luxury brands.",
    skills: ["event planning", "project management", "attention to detail"],
  },
  {
    title: "Luxury Digital Strategist",
    description: "Lead digital campaigns for premium products.",
    skills: ["digital marketing", "creativity", "analytics"],
  },
  {
    title: "Bespoke Product Designer",
    description: "Design personalized luxury items for top clients.",
    skills: ["design", "client interaction", "creativity"],
  },
];

const ALL_SKILLS = [
  "market research",
  "data analysis",
  "luxury branding",
  "communication",
  "relationship management",
  "sales",
  "event planning",
  "project management",
  "attention to detail",
  "digital marketing",
  "creativity",
  "analytics",
  "design",
  "client interaction",
  "presentation",
  "leadership",
  "innovation",
  "trend spotting",
];

/** Returns the top 2 jobs that best match userSkills/careerGoal */
function getJobMatches(userSkills, careerGoal) {
  if (!userSkills.length && careerGoal.trim() === "") return [];
  const scoredJobs = MOCK_JOBS.map((job) => {
    // Score by matching skill overlap and text similarity
    const matchSkills = job.skills.filter((skill) =>
      userSkills.includes(skill)
    );
    const goalScore =
      careerGoal &&
      (job.title.toLowerCase().includes(careerGoal.toLowerCase()) ||
        job.description.toLowerCase().includes(careerGoal.toLowerCase()))
        ? 1
        : 0;
    return { ...job, score: matchSkills.length + goalScore };
  });
  // Highest score first, return top 2
  return scoredJobs
    .sort((a, b) => b.score - a.score)
    .filter((job) => job.score > 0)
    .slice(0, 2);
}

/** Returns top 5 missing skills */
function getSkillRecommendations(userSkills, jobMatches) {
  let recommended = [];
  jobMatches.forEach((job) => {
    job.skills.forEach((skill) => {
      if (!userSkills.includes(skill) && !recommended.includes(skill)) {
        recommended.push(skill);
      }
    });
  });
  // Fallback: recommend random skills not already owned if none from matches
  if (recommended.length < 5) {
    ALL_SKILLS.forEach((skill) => {
      if (
        !userSkills.includes(skill) &&
        !recommended.includes(skill) &&
        recommended.length < 5
      ) {
        recommended.push(skill);
      }
    });
  }
  return recommended.slice(0, 5);
}

/* ----------- NavigationBar Component ----------- */
function NavigationBar() {
  const location = useLocation();
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/profile", label: "Profile" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/about", label: "About" },
  ];
  return (
    <nav className="navbar lux-navbar">
      <div className="container" style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div className="logo">
            <span className="logo-symbol" style={{ color: "#ff0026", fontWeight: 800 }}>&#9673;</span>
            LuxMatch <span style={{ color: "#3400ff" }}>Pro</span>
          </div>
          <ul className="lux-nav-list" style={{ display: "flex", gap: "24px", margin: 0, listStyle: "none", padding: 0 }}>
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`lux-nav-link${location.pathname === to ? " lux-active-link" : ""}`}
                  style={{
                    color: location.pathname === to ? "#ff0026" : "#fff",
                    textDecoration: "none",
                    fontWeight: 500,
                    fontSize: "1rem",
                    transition: "color .2s",
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

/* ----------- Page Components ----------- */
function Home() {
  return (
    <div className="lux-card">
      <div className="lux-card-body" style={{ textAlign: "center" }}>
        <div className="subtitle" style={{ color: "#ff0026" }}>Luxury Career Matching</div>
        <h1 className="title" style={{ color: "#3400ff" }}>Welcome to LuxMatch Pro</h1>
        <div className="description">
          Find your dream job in the world of luxury. Get matched to elite positions and discover exactly which skills will open VIP doors for you.
        </div>
        <Link to="/profile">
          <button className="btn btn-large lux-cta-btn">Get Started</button>
        </Link>
      </div>
    </div>
  );
}

function Profile({ userProfile, setUserProfile, onAnalyze }) {
  const [localName, setLocalName] = useState(userProfile.name || "");
  const [localSkills, setLocalSkills] = useState(userProfile.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [localGoal, setLocalGoal] = useState(userProfile.careerGoal || "");
  const navigate = useNavigate();

  const handleAddSkill = (e) => {
    e.preventDefault();
    const skill = skillInput.trim().toLowerCase();
    if (skill && !localSkills.includes(skill)) {
      setLocalSkills([...localSkills, skill]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skill) => {
    setLocalSkills(localSkills.filter((s) => s !== skill));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserProfile({
      name: localName,
      skills: localSkills,
      careerGoal: localGoal,
    });
    onAnalyze(localSkills, localGoal);
    navigate("/dashboard");
  };

  return (
    <div className="lux-card">
      <div className="lux-card-body">
        <h2 className="title" style={{ fontSize: "2.3rem", color: "#ff0026", margin: "0 0 1rem" }}>Profile Analysis</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <label>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>Your Name</div>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              required
              className="lux-input"
              placeholder="Enter your name"
              autoComplete="off"
            />
          </label>
          <label>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>Your Skills</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              {localSkills.map((skill) => (
                <span key={skill} className="lux-skill-chip" title="Click to remove" onClick={() => handleRemoveSkill(skill)}>
                  {skill} <span style={{ color: "#ff0026", marginLeft: 2, fontWeight: 600, cursor: "pointer" }}>×</span>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="lux-input"
                placeholder="Add a skill, e.g., sales"
                autoComplete="off"
                onKeyDown={e => { if (e.key === "Enter") handleAddSkill(e); }}
              />
              <button className="btn lux-btn-small" style={{ padding: "8px 12px" }} type="button" onClick={handleAddSkill}>
                Add Skill
              </button>
            </div>
          </label>
          <label>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>Career Goal</div>
            <input
              type="text"
              value={localGoal}
              onChange={(e) => setLocalGoal(e.target.value)}
              className="lux-input"
              placeholder="e.g., VIP Relationship Manager"
              autoComplete="off"
            />
          </label>
          <button className="btn btn-large lux-cta-btn" type="submit">
            Analyze My Matches
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ userProfile, jobMatches, skillRecs }) {
  return (
    <div className="lux-card">
      <div className="lux-card-body">
        <h2 className="title" style={{ fontSize: "2.2rem", color: "#3400ff" }}>
          Dashboard
        </h2>
        <div className="description" style={{ margin: "4px 0 18px" }}>
          {userProfile.name
            ? <>Hello, <b>{userProfile.name}</b>! Here are your luxury job matches and skill opportunities.</>
            : <>Please complete your profile to get personalized results.</>}
        </div>
        {jobMatches.length > 0 ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ color: "#ff0026", margin: 0, fontSize: "1.2rem" }}>Top Job Matches</h3>
              <div className="lux-matches-list">
                {jobMatches.map((job, idx) => (
                  <div key={job.title} className="lux-job-match">
                    <div className="lux-job-left">
                      <div style={{ fontWeight: 600, color: "#3400ff" }}>{idx + 1}. {job.title}</div>
                      <div style={{ fontSize: "1rem", color: "#444", marginTop: 2, marginBottom: 3 }}>{job.description}</div>
                      <div className="lux-tag-list">
                        {job.skills.map((skill) => (
                          <span className="lux-tag" key={skill}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#ff0026", fontSize: "1.1rem" }}>Top Skills to Boost Your Profile</h3>
              <div className="lux-tag-list">
                {skillRecs.map((skill) => (
                  <span className="lux-tag lux-tag-plus" key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ color: "#888", fontStyle: "italic" }}>
            No matches yet. Fill out your profile to get started!
          </div>
        )}
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="lux-card">
      <div className="lux-card-body">
        <h2 className="title" style={{ fontSize: "2rem", color: "#3400ff" }}>About LuxMatch Pro</h2>
        <div className="description" style={{ maxWidth: 700, margin: "0 auto", color: "#333" }}>
          LuxMatch Pro is your exclusive gateway to a career among the elite. Our platform leverages luxury market insights and modern technology to match you with prestigious roles and offer skill-building recommendations so you stand out in the high-end market. <br /><br />
          <b>Build your profile. Match your ambitions. Step into the world of luxury.</b>
        </div>
        <ul style={{ margin: "24px 0 0", padding: "0 0 0 20px", color: "#444", fontSize: "1rem" }}>
          <li>🛍️ Personalized job matching</li>
          <li>🎓 Curated skill improvement tips</li>
          <li>🎉 Modern, responsive UI</li>
          <li>🔐 No data stored—demo only!</li>
        </ul>
      </div>
    </div>
  );
}

/* ----------- Main App Component ----------- */
function App() {
  // PUBLIC_INTERFACE
  /** Root component managing global state and routing */
  const [userProfile, setUserProfile] = useState({
    name: "",
    skills: [],
    careerGoal: "",
  });
  const [jobMatches, setJobMatches] = useState([]);
  const [skillRecs, setSkillRecs] = useState([]);

  // Called when profile is submitted/analyzed
  function handleAnalyze(skills, goal) {
    const matches = getJobMatches(skills, goal);
    setJobMatches(matches);
    setSkillRecs(getSkillRecommendations(skills, matches));
  }

  // Ensure matches/skills update if going back to profile and changing info
  React.useEffect(() => {
    if (userProfile.skills.length || userProfile.careerGoal) {
      const matches = getJobMatches(userProfile.skills, userProfile.careerGoal);
      setJobMatches(matches);
      setSkillRecs(getSkillRecommendations(userProfile.skills, matches));
    }
  }, [userProfile]);

  return (
    <Router>
      <div
        className="app lux-app-bg"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #ff0026, #3400ff)",
        }}
      >
        <NavigationBar />
        <main>
          <div className="lux-main-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/profile"
                element={
                  <Profile
                    userProfile={userProfile}
                    setUserProfile={setUserProfile}
                    onAnalyze={handleAnalyze}
                  />
                }
              />
              <Route
                path="/dashboard"
                element={
                  <Dashboard
                    userProfile={userProfile}
                    jobMatches={jobMatches}
                    skillRecs={skillRecs}
                  />
                }
              />
              <Route path="/about" element={<About />} />
              {/* Fallback: Home for unknown routes */}
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;