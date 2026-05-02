import React, { useState } from 'react';
import '../Pages/style/Docs.scss'
import { Copy, Check, Terminal, Code2, ShieldCheck, Activity, Key, Layers } from 'lucide-react';

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
      title: 'Introduction',
      icon: <Layers size={22} />,
      content: "Winston is a versatile logging library for Node.js, designed to be a universal logging middleware with support for multiple storage mechanisms. It allows developers to decouple logging from the application logic by providing 'transports'—modules that deliver logs to consoles, files, or external cloud services.",
    },
    {
      id: 'install',
      title: 'Installation',
      icon: <Terminal size={22} />,
      desc: 'Install the winston package via npm to begin integration:',
      code: 'npm install winston@^3.19.0',
      lang: 'bash'
    },
    {
      id: 'logger',
      title: 'Logger Utility',
      icon: <Code2 size={22} />,
      desc: 'Configure the logger in `src/utils/logger.js`. This setup ensures all application errors are captured in a structured JSON format.',
      code: `import winston from 'winston';
import path from 'path';

export const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(), 
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(process.cwd(), 'logs/error.log') }),
    new winston.transports.Console(),
  ],
});`,
      lang: 'utils/logger.js'
    },
    {
      id: 'security',
      title: 'Secure Log Access',
      icon: <ShieldCheck size={22} />,
      desc: 'Implement a monitoring route in `src/routes/logRoutes.js` to securely retrieve log files using a secret token.',
      code: `import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.get('/raw-logs', (req, res) => {
  const secret = req.query.monitor_token;

  if (secret !== process.env.MONITOR_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  const logPath = path.join(process.cwd(), 'logs/error.log');

  if (fs.existsSync(logPath)) {
    res.setHeader('Content-Type', 'text/plain');
    return res.sendFile(logPath);
  } else {
    return res.status(404).send('No logs recorded yet.');
  }
});

export default router;`,
      lang: 'routes/logRoutes.js'
    },
    {
      id: 'service',
      title: 'Server Integration',
      icon: <Activity size={22} />,
      desc: 'Integrate the logging service into your main `server.js` file to catch and log all application errors.',
      code: `import express from 'express';
import logRoutes from './src/routes/logRoutes.js';
import { logger } from './src/utils/logger.js';

const app = express();

app.use('/api/monitoring', logRoutes);

app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});`,
      lang: 'server.js'
    },
    {
      id: 'env',
      title: 'Environment Variables',
      icon: <Key size={22} />,
      desc: 'Create a `.env` file in your root directory. Ensure the MONITOR_TOKEN matches the one used in your requests.',
      code: `PORT=3000
MONITOR_TOKEN=your_secure_secret_token_here`,
      lang: '.env'
    }
  ];

  return (
    <div className="docs-container">
      <aside className="docs-sidebar">
        <div className="docs-brand">
          <div className="status-dot"></div>
          <h2>Winston<span>Monitor</span></h2>
        </div>
        <nav className="docs-nav">
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} className="docs-nav-item">{s.title}</a>
          ))}
        </nav>
      </aside>

      <main className="docs-main">
        <header className="docs-header">
          <div className="docs-breadcrumb">Documentation / Backend / <span>Logger Service</span></div>
          <div className="docs-version">v3.19.0</div>
        </header>

        <div className="docs-scroll-area">
          {sections.map((sec) => (
            <section id={sec.id} key={sec.id} className="docs-section">
              <div className="docs-section-header">
                <span className="docs-icon">{sec.icon}</span>
                <h2>{sec.title}</h2>
              </div>
              
              {sec.content && <p className="docs-text-large">{sec.content}</p>}
              {sec.desc && <p className="docs-text-normal">{sec.desc}</p>}

              {sec.code && (
                <div className="docs-code-card">
                  <div className="docs-code-top">
                    <span className="docs-file-name">{sec.lang}</span>
                    <button className="docs-copy-btn" onClick={() => copyToClipboard(sec.code, sec.id)}>
                      {copied === sec.id ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <pre className="docs-pre"><code>{sec.code}</code></pre>
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