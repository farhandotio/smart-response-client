import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Copy,
  Check,
  Terminal,
  Code2,
  ShieldCheck,
  Activity,
  Key,
  Layers,
  Home,
  Server,
  Zap,
  Menu,
  X,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import './styles/docs.scss';

const sections = [
  {
    id: 'intro',
    title: 'Integration Overview',
    icon: <Layers size={16} />,
    content:
      'SIRP AI monitors your application by fetching logs from a secure endpoint on your server. To enable AI-driven diagnostics, expose a structured JSON log file via a protected route that our system can access periodically.',
    type: 'text',
  },
  {
    id: 'install',
    title: 'Prerequisites',
    icon: <Terminal size={16} />,
    desc: 'We recommend using Winston for structured logging. Install it in your Node.js project:',
    code: 'npm install winston',
    lang: 'bash',
    type: 'code',
  },
  {
    id: 'logger',
    title: 'Logger Configuration',
    icon: <Code2 size={16} />,
    desc: 'Set up a logger that saves errors into a local JSON file. This lets our AI parse stack traces accurately.',
    code: `import winston from 'winston';
import path from 'path';

export const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs/error.log')
    })
  ],
});`,
    lang: 'utils/logger.js',
    type: 'code',
  },
  {
    id: 'security',
    title: 'Secure Log Endpoint',
    icon: <ShieldCheck size={16} />,
    desc: 'Create a route to serve the log file. Protect it with a MONITOR_TOKEN so only our system can read your logs.',
    code: `import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.get('/raw-logs', (req, res) => {
  const token = req.query.monitor_token;

  if (!token || token !== process.env.MONITOR_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const logPath = path.join(process.cwd(), 'logs/error.log');

  if (fs.existsSync(logPath)) {
    res.setHeader('Content-Type', 'text/plain');
    return res.sendFile(logPath);
  }
  res.status(404).send('No logs found.');
});

export default router;`,
    lang: 'routes/monitor.js',
    type: 'code',
    callout:
      'You MUST protect this endpoint with a strong secret token. Never expose raw logs without authentication.',
  },
  {
    id: 'middleware',
    title: 'Error Handling Middleware',
    icon: <Activity size={16} />,
    desc: 'Capture all application crashes using a global error middleware and feed them into the logger.',
    code: `app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(500).json({ success: false, message: 'Internal Error' });
});`,
    lang: 'server.js',
    type: 'code',
  },
  {
    id: 'env',
    title: 'Finalizing Connection',
    icon: <Key size={16} />,
    desc: 'After deploying your server, go to your SIRP AI Dashboard and add your endpoint URL. Generate a strong secret for MONITOR_TOKEN.',
    code: `MONITOR_TOKEN=generate_a_strong_secret_key`,
    lang: '.env',
    type: 'code',
    callout:
      'Add this URL in your dashboard: https://your-api.com/api/monitoring/raw-logs?monitor_token=YOUR_TOKEN',
    final: true,
  },
];

const Docs = () => {
  const [copied, setCopied] = useState(null);
  const [activeId, setActiveId] = useState('intro');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bodyRef = useRef(null);

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Track active section on scroll
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    const handler = () => {
      const scrollTop = el.scrollTop;
      let current = sections[0].id;

      sections.forEach((s) => {
        const node = document.getElementById(s.id);
        if (node && node.offsetTop - 80 <= scrollTop) current = s.id;
      });

      setActiveId(current);
    };

    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id) => {
    const node = document.getElementById(id);
    if (node && bodyRef.current) {
      bodyRef.current.scrollTo({ top: node.offsetTop - 48, behavior: 'smooth' });
    }
    setSidebarOpen(false);
  };

  return (
    <div className="docs">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && <div className="sb-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sb-top">
          <Link to="/" className="sb-brand">
            {/* <div className="sb-mark">
              <Zap size={14} fill="var(--accent)" color="var(--accent)" />
            </div> */}
            S<span className="acc">Response</span>
          </Link>
        </div>

        <div className="sb-scroll">
          <div className="sb-section-label">Core Integration</div>

          {sections.map((s) => (
            <button
              key={s.id}
              className={`sb-link ${activeId === s.id ? 'active' : ''}`}
              onClick={() => scrollTo(s.id)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                font: 'inherit',
              }}
            >
              {s.icon}
              {s.title}
            </button>
          ))}

          <div className="sb-divider" />

          <Link to="/" className="sb-back">
            <Home size={14} />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="docs-main">
        {/* Top bar */}
        <header className="docs-topbar">
          <div className="topbar-left">
            <button
              className="menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Menu"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <nav className="breadcrumb">
              <Link to="/">Home</Link>
              <span className="sep">/</span>
              <span>Resources</span>
              <span className="sep">/</span>
              <span className="curr">Agent Integration</span>
            </nav>
          </div>

          <div className="topbar-right">
            <div className="status-badge">
              <div className="pulse" />
              <Server size={11} />
              System Active
            </div>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="docs-body" ref={bodyRef}>
          {/* Hero */}
          <div className="docs-hero">
            <div className="hero-tag">Developer Docs</div>
            <h1>
              Integrate Your <span className="grad">App</span>
            </h1>
            <p>
              Connect your server logs to our AI diagnostic engine in minutes. Follow the steps
              below to get started.
            </p>
          </div>

          {/* Steps row */}
          <div className="steps-row">
            {sections.map((s, i) => (
              <button
                key={s.id}
                className="step-chip"
                onClick={() => scrollTo(s.id)}
                style={{
                  background: 'none',
                  cursor: 'pointer',
                  font: 'inherit',
                  border: 'none',
                  padding: 0,
                }}
              >
                <div
                  className="step-chip"
                  style={{
                    background: activeId === s.id ? 'var(--accent-dim)' : undefined,
                    borderColor: activeId === s.id ? 'var(--accent-mid)' : undefined,
                    color: activeId === s.id ? 'var(--accent)' : undefined,
                  }}
                >
                  <div className="step-num">{i + 1}</div>
                  {s.title}
                </div>
              </button>
            ))}
          </div>

          {/* Sections */}
          {sections.map((sec) => (
            <section id={sec.id} key={sec.id} className="doc-section">
              <div className="section-head">
                <div className="section-icon">{sec.icon}</div>
                <h2>{sec.title}</h2>
              </div>

              {sec.content && <p className="doc-text lg">{sec.content}</p>}

              {sec.desc && <p className="doc-text">{sec.desc}</p>}

              {sec.code && (
                <div className="code-block">
                  <div className="code-top">
                    <span className="code-lang">
                      <span className="lang-dot" />
                      {sec.lang}
                    </span>
                    <button
                      className={`copy-btn ${copied === sec.id ? 'done' : ''}`}
                      onClick={() => copy(sec.code, sec.id)}
                    >
                      {copied === sec.id ? (
                        <>
                          <Check size={12} /> Copied
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre>
                    <code>{sec.code}</code>
                  </pre>
                </div>
              )}

              {sec.callout && (
                <div className="callout">
                  <AlertCircle size={15} />
                  <p>{sec.callout}</p>
                </div>
              )}

              {sec.final && (
                <div className="done-card" style={{ marginTop: 32 }}>
                  <div className="done-icon">
                    <Zap size={20} fill="var(--accent)" color="var(--accent)" />
                  </div>
                  <h3>You're all set!</h3>
                  <p>
                    Your integration is complete. Head to the dashboard to see your logs flowing in
                    real-time.
                  </p>
                  <Link to="/dashboard">
                    Open Dashboard <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Docs;
