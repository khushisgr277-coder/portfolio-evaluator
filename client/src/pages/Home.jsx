import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaSearch, FaTimes } from 'react-icons/fa';

// Smart parser: handles full URLs, "user/repo", or plain "username"
function extractUsername(input) {
  const trimmed = input.trim();

  // Full URL: https://github.com/username or https://github.com/username/repo
  try {
    const url = new URL(trimmed);
    if (url.hostname === 'github.com') {
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length > 0) return parts[0];
    }
  } catch (_) {
    // Not a URL, continue
  }

  // "username/repo" format
  if (trimmed.includes('/')) {
    const parts = trimmed.split('/').filter(Boolean);
    return parts[0];
  }

  // Plain username
  return trimmed;
}

// Validate GitHub username format
function isValidUsername(username) {
  return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username);
}

export default function Home() {
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const [preview, setPreview] = useState(null); // shows parsed username
  const navigate = useNavigate();

  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val.trim()) {
      const parsed = extractUsername(val);
      setPreview(parsed || null);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = extractUsername(input);
    if (username && isValidUsername(username)) {
      navigate(`/report/${username}`);
    }
  };

  const parsedUsername = input.trim() ? extractUsername(input) : null;
  const valid = parsedUsername && isValidUsername(parsedUsername);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '1rem', position: 'relative', overflow: 'hidden'
    }}>
      {/* Ambient blobs */}
      {[
        { color: 'rgba(79,70,229,0.15)', top: '-80px', left: '-80px' },
        { color: 'rgba(168,85,247,0.12)', top: '-40px', right: '-60px' },
        { color: 'rgba(236,72,153,0.1)', bottom: '-60px', left: '60px' },
      ].map((s, i) => (
        <div key={i} style={{
          position: 'absolute', width: 320, height: 320, borderRadius: '50%',
          background: s.color, filter: 'blur(80px)',
          top: s.top, left: s.left, right: s.right, bottom: s.bottom,
          pointerEvents: 'none'
        }} />
      ))}

      <div style={{
        maxWidth: 600, width: '100%', textAlign: 'center',
        background: 'rgba(17,24,39,0.6)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(55,65,81,0.8)', borderRadius: '1.25rem',
        padding: '3.5rem 2.5rem', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.6)',
        position: 'relative', zIndex: 1
      }}>
        {/* Icon */}
        <div style={{
          display: 'inline-flex', padding: '1rem',
          background: 'rgba(31,41,55,0.8)', borderRadius: '1rem',
          border: '1px solid rgba(75,85,99,0.5)', marginBottom: '2rem',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)'
        }}>
          <FaGithub style={{ fontSize: '3.5rem', color: '#fff' }} />
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Developer{' '}
          <span style={{
            background: 'linear-gradient(90deg,#818cf8,#c084fc,#f472b6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>
            Portfolio Evaluator
          </span>
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: 1.7, maxWidth: 460, margin: '0 auto 2.5rem' }}>
          Enter a GitHub username, profile URL, or repo link — we'll evaluate the developer behind it.
        </p>

        {/* Search form */}
        <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            background: 'rgba(17,24,39,0.8)',
            border: `1.5px solid ${focused ? '#6366f1' : valid ? '#10b981' : 'rgba(75,85,99,0.6)'}`,
            borderRadius: '0.75rem', overflow: 'hidden',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.2)' : valid && !focused ? '0 0 0 2px rgba(16,185,129,0.15)' : 'none'
          }}>
            <FaSearch style={{ color: focused ? '#818cf8' : '#6b7280', marginLeft: '1rem', flexShrink: 0, transition: 'color .2s' }} />
            <input
              type="text"
              value={input}
              onChange={handleChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="username, github.com/user, or paste any GitHub link..."
              style={{
                flex: 1, padding: '0.9rem 0.75rem', background: 'transparent',
                border: 'none', outline: 'none', color: '#fff', fontSize: '0.9rem',
                fontFamily: 'Inter, sans-serif'
              }}
            />
            {input && (
              <button type="button" onClick={() => { setInput(''); setPreview(null); }}
                style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '0 0.5rem' }}>
                <FaTimes />
              </button>
            )}
            <button
              type="submit"
              disabled={!valid}
              style={{
                margin: '0.4rem', padding: '0.6rem 1.2rem',
                background: valid
                  ? 'linear-gradient(90deg,#4f46e5,#7c3aed,#db2777)'
                  : 'rgba(55,65,81,0.8)',
                border: 'none', borderRadius: '0.5rem',
                color: valid ? '#fff' : '#6b7280',
                fontWeight: 600, fontSize: '0.85rem',
                cursor: valid ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap'
              }}
            >
              Evaluate ↗
            </button>
          </div>

          {/* Smart preview badge */}
          {parsedUsername && (
            <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
              {valid ? (
                <>
                  <span style={{ color: '#6b7280' }}>Evaluating:</span>
                  <span style={{
                    background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                    color: '#34d399', padding: '2px 10px', borderRadius: 999, fontWeight: 600
                  }}>
                    @{parsedUsername}
                  </span>
                </>
              ) : (
                <span style={{ color: '#f87171' }}>Invalid GitHub username format</span>
              )}
            </div>
          )}
        </form>

        {/* Examples */}
        <div style={{ marginTop: '1.5rem', color: '#4b5563', fontSize: '0.78rem' }}>
          Works with:&nbsp;
          {[
            { label: 'username', val: 'torvalds' },
            { label: 'github.com/user', val: 'github.com/gaearon' },
            { label: 'profile URL', val: 'https://github.com/khushisgr277-coder' },
          ].map(({ label, val }) => (
            <button key={label} onClick={() => { setInput(val); const u = extractUsername(val); setPreview(u); }}
              style={{
                background: 'none', border: 'none', color: '#6366f1',
                cursor: 'pointer', textDecoration: 'underline', fontSize: '0.78rem',
                fontFamily: 'Inter, sans-serif', margin: '0 0.4rem'
              }}>{label}</button>
          ))}
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          {[
            { color: '#6366f1', label: 'Activity' },
            { color: '#a855f7', label: 'Code Quality' },
            { color: '#ec4899', label: 'Community' },
            { color: '#10b981', label: 'Hiring Ready' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#6b7280' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
