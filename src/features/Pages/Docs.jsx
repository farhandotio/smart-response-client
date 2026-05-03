import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Pages/style/Docs.scss';
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
} from 'lucide-react';

const Docs = () => {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sections = [
    {
      id: 'intro',
      title: 'Integration Overview',
      icon: <Layers size={22} />,
      content:
        'Smart Response monitors your application by fetching logs from a secure endpoint on your server. To enable AI-driven diagnostics, you need to expose a structured JSON log file via a protected route that our system can access periodically.',
    },
    {
      id: 'install',
      title: 'Prerequisites',
      icon: <Terminal size={22} />,
      desc: 'We recommend using Winston for structured logging. Install it in your Node.js project:',
      code: 'npm install winston',
      lang: 'bash',
    },
    {
      id: 'logger',
      title: 'Logger Configuration',
      icon: <Code2 size={22} />,
      desc: 'Setup a logger that saves errors into a local file in JSON format. This allows our AI to parse stack traces accurately.',
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
    },
    {
      id: 'security',
      title: 'Secure Log Endpoint',
      icon: <ShieldCheck size={22} />,
      desc: 'Create a route to serve the log file. You MUST protect this with a MONITOR_TOKEN so only our system can read your logs.',
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
    },
    {
      id: 'middleware',
      title: 'Error Handling',
      icon: <Activity size={22} />,
      desc: 'Capture all application crashes using a global error middleware and feed them to the logger.',
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
    },
    {
      id: 'env',
      title: 'Finalizing Connection',
      icon: <Key size={22} />,
      desc: 'After deploying your server, go to your Smart Response Dashboard and add your URL: https://your-api.com/api/monitoring/raw-logs?monitor_token=YOUR_TOKEN',
      code: `MONITOR_TOKEN=generate_a_strong_secret_key`,
      lang: '.env',
    },
  ];

  return (
    <div className="docs-container">
      <aside className="docs-sidebar">
        <Link to="/" className="docs-brand-link">
          <div className="docs-brand">
            <div className="status-dot"></div>
            <h2>
              Smart <span> Response</span>
            </h2>
          </div>
        </Link>
        <nav className="docs-nav">
          <div className="nav-label">Core Integration</div>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="docs-nav-item">
              <span className="nav-icon">{s.icon}</span>
              {s.title}
            </a>
          ))}
        </nav>
      </aside>

      <main className="docs-main">
        <header className="docs-header">
          <div className="docs-breadcrumb">
            Resources / Developers / <span>Agent Integration</span>
          </div>
          <div className="docs-status-badge">
            <Server size={14} /> System Active
          </div>
        </header>

        <div className="docs-scroll-area">
          <div className="docs-intro-hero">
            <h1>Integrate Your App</h1>
            <p>Connect your server logs to our AI diagnostic engine in minutes.</p>
          </div>

          {sections.map((sec) => (
            <section id={sec.id} key={sec.id} className="docs-section">
              <div className="docs-section-header">
                <h2>{sec.title}</h2>
              </div>

              {sec.content && <p className="docs-text-large">{sec.content}</p>}
              {sec.desc && <p className="docs-text-normal">{sec.desc}</p>}

              {sec.code && (
                <div className="docs-code-card">
                  <div className="docs-code-top">
                    <span className="docs-file-name">{sec.lang}</span>
                    <button
                      className="docs-copy-btn"
                      onClick={() => copyToClipboard(sec.code, sec.id)}
                    >
                      {copied === sec.id ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <pre className="docs-pre">
                    <code>{sec.code}</code>
                  </pre>
                </div>
              )}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Docs;
