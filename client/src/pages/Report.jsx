import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import {
  FaArrowLeft, FaShareAlt, FaMapMarkerAlt, FaLink,
  FaGithub, FaExclamationTriangle, FaStar, FaCodeBranch,
  FaUsers, FaBook, FaCheckCircle
} from 'react-icons/fa';

// ─── Score Category Card ──────────────────────────────────────────────────────
function ScoreCard({ label, score, max, color, icon }) {
  const pct = Math.min(100, (score / max) * 100);
  return (
    <div style={{
      background: 'rgba(17,24,39,0.6)',
      border: '1px solid rgba(55,65,81,0.8)',
      borderRadius: '0.75rem',
      padding: '1rem 1.25rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {icon} {label}
        </span>
        <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
          {score.toFixed(1)} <span style={{ color: '#6b7280', fontWeight: 400 }}>/ {max}</span>
        </span>
      </div>
      <div className="score-bar">
        <div className="score-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── Circular Score Ring ──────────────────────────────────────────────────────
function ScoreRing({ total }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (circumference * Math.min(total, 100)) / 100;
  return (
    <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="160" height="160" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="none" stroke="#1f2937" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="45" fill="none"
          stroke="url(#scoreGrad)" strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>
          {Math.round(total)}
        </div>
        <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>/ 100</div>
      </div>
    </div>
  );
}

// ─── Main Report Page ─────────────────────────────────────────────────────────
export default function Report() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setData(null);
    setError(null);
    setLoading(true);

    axios.get(`http://localhost:5000/api/profile/${username}`)
      .then(res => setData(res.data))
      .catch(err => {
        const msg = err.response?.data?.message || err.message || 'Failed to fetch profile.';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [username]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Loading ──
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
          width: 56, height: 56,
          border: '4px solid #4f46e5',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>Analyzing <strong style={{ color: '#a5b4fc' }}>@{username}</strong> on GitHub…</p>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="glass-panel" style={{ maxWidth: 420, width: '100%', padding: '2.5rem', textAlign: 'center' }}>
          <FaExclamationTriangle style={{ fontSize: '3rem', color: '#f87171', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Something went wrong</h2>
          <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>{error}</p>
          <Link to="/" className="btn-primary">← Back to Search</Link>
        </div>
      </div>
    );
  }

  // ── No data guard ──
  if (!data || !data.scores || !data.profile || !data.stats) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#9ca3af' }}>No data available for <strong>@{username}</strong></p>
      </div>
    );
  }

  const { profile, scores, stats } = data;

  // Radar chart config
  const radarData = {
    labels: ['Activity', 'Code Quality', 'Diversity', 'Community', 'Hiring Ready'],
    datasets: [{
      label: 'Score',
      data: [scores.activity ?? 0, scores.quality ?? 0, scores.diversity ?? 0, scores.community ?? 0, scores.hiring ?? 0],
      backgroundColor: 'rgba(99,102,241,0.25)',
      borderColor: '#818cf8',
      pointBackgroundColor: '#f472b6',
      pointBorderColor: '#fff',
      borderWidth: 2,
    }]
  };

  const radarOptions = {
    scales: {
      r: {
        min: 0, max: 25,
        angleLines: { color: 'rgba(255,255,255,0.08)' },
        grid: { color: 'rgba(255,255,255,0.08)' },
        pointLabels: {
          color: 'rgba(255,255,255,0.7)',
          font: { size: 11, family: 'Inter, sans-serif' }
        },
        ticks: { display: false }
      }
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
    responsive: true,
  };

  const languages = Object.entries(stats.languages || {}).sort(([, a], [, b]) => b - a);
  const langColors = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1rem 0' }}>

        {/* ── Top bar ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem', transition: 'color .2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
          >
            <FaArrowLeft /> Search Another
          </Link>
          <button onClick={handleShare} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(31,41,55,0.9)', border: '1px solid rgba(75,85,99,0.8)',
            color: '#fff', padding: '0.5rem 1.2rem', borderRadius: '0.5rem',
            cursor: 'pointer', fontSize: '0.85rem', transition: 'background .2s'
          }}>
            <FaShareAlt /> {copied ? '✓ Copied!' : 'Share'}
          </button>
        </div>

        {/* ── Main Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

          {/* ── Left: Profile Card ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
                <img
                  src={profile.avatar_url}
                  alt={profile.name || username}
                  style={{ width: 120, height: 120, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.5)', objectFit: 'cover', boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}
                />
                <div style={{
                  position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
                  background: '#111827', border: '1px solid #374151',
                  padding: '2px 10px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700,
                  whiteSpace: 'nowrap', color: '#c4b5fd'
                }}>
                  LVL {Math.floor((scores.total || 0) / 10)}
                </div>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                {profile.name || username}
              </h2>
              <a href={profile.html_url} target="_blank" rel="noreferrer"
                style={{ color: '#818cf8', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                <FaGithub /> @{username}
              </a>
              {profile.bio && (
                <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '1rem', lineHeight: 1.6 }}>
                  {profile.bio}
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap', fontSize: '0.8rem', color: '#9ca3af' }}>
                {profile.location && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FaMapMarkerAlt /> {profile.location}
                  </span>
                )}
                {profile.blog && (
                  <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                    target="_blank" rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#818cf8', textDecoration: 'none' }}>
                    <FaLink /> Website
                  </a>
                )}
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', borderTop: '1px solid rgba(55,65,81,0.8)', marginTop: '1.5rem', paddingTop: '1.25rem' }}>
                {[
                  { icon: <FaUsers />, val: (profile.followers || 0).toLocaleString(), label: 'Followers' },
                  { icon: <FaBook />, val: profile.public_repos || 0, label: 'Repos' },
                  { icon: <FaStar />, val: (stats.totalStars || 0).toLocaleString(), label: 'Stars' },
                ].map(({ icon, val, label }) => (
                  <div key={label}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>{val}</div>
                    <div style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Score */}
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <h3 style={{ color: '#d1d5db', fontWeight: 600, fontSize: '1rem', margin: 0 }}>Overall Score</h3>
              <ScoreRing total={scores.total || 0} />
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                {scores.total >= 70 ? '🟢 Strong Profile' : scores.total >= 45 ? '🟡 Good Progress' : '🔴 Needs Improvement'}
              </div>
            </div>
          </div>

          {/* ── Right: Charts & Breakdown ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Radar Chart */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ color: '#d1d5db', fontWeight: 600, fontSize: '1rem', marginBottom: '1.25rem' }}>Score Breakdown</h3>
              <div className="chart-container">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>

            {/* Score Bars */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ color: '#d1d5db', fontWeight: 600, fontSize: '1rem', marginBottom: '1.25rem' }}>Category Scores</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <ScoreCard label="Activity" score={scores.activity ?? 0} max={25} color="linear-gradient(90deg,#6366f1,#818cf8)" icon={<FaCodeBranch />} />
                <ScoreCard label="Code Quality" score={scores.quality ?? 0} max={20} color="linear-gradient(90deg,#7c3aed,#a855f7)" icon={<FaCheckCircle />} />
                <ScoreCard label="Diversity" score={scores.diversity ?? 0} max={20} color="linear-gradient(90deg,#db2777,#ec4899)" icon={<FaBook />} />
                <ScoreCard label="Community" score={scores.community ?? 0} max={20} color="linear-gradient(90deg,#0ea5e9,#38bdf8)" icon={<FaUsers />} />
                <ScoreCard label="Hiring Ready" score={scores.hiring ?? 0} max={15} color="linear-gradient(90deg,#059669,#34d399)" icon={<FaStar />} />
              </div>
            </div>

            {/* Languages */}
            {languages.length > 0 && (
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ color: '#d1d5db', fontWeight: 600, fontSize: '1rem', marginBottom: '1.25rem' }}>Top Languages</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {languages.map(([lang, count], i) => (
                    <div key={lang} style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      background: 'rgba(31,41,55,0.8)', border: '1px solid rgba(75,85,99,0.5)',
                      padding: '0.35rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.8rem'
                    }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: langColors[i % langColors.length], flexShrink: 0 }} />
                      <span style={{ color: '#e5e7eb', fontWeight: 500 }}>{lang}</span>
                      <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Keyframe for spinner ── */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
