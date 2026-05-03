import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = {
  'Timeline View':
    'Track every action, decision, and update — a single source of truth for the full incident lifecycle.',
  'Log Analytics':
    'AI-powered log parsing that surfaces critical failures instantly. No manual grep required.',
  'Team Status':
    'Real-time presence and assignment status of your response unit across all time zones.',
};

const mockData = {
  'Timeline View': {
    cards: [
      { label: 'Active Incidents', val: '3', bar: 30 },
      { label: 'Resolved Today', val: '17', bar: 85 },
    ],
    items: [
      {
        dot: 'dot-g',
        name: 'DB cluster — resolved',
        sub: 'Root cause: memory leak',
        time: '4m ago',
      },
      { dot: 'dot-y', name: 'API latency spike', sub: 'Under investigation', time: '12m ago' },
      { dot: 'dot-r', name: 'Auth service down', sub: 'Escalated to on-call', time: '31m ago' },
    ],
  },
  'Log Analytics': {
    cards: [
      { label: 'Log Entries / min', val: '84k', bar: 65 },
      { label: 'Anomaly Score', val: '0.07', bar: 7 },
    ],
    items: [
      { dot: 'dot-g', name: 'nginx — normal traffic', sub: 'p99 < 120ms', time: '1s ago' },
      { dot: 'dot-y', name: 'postgres — slow queries', sub: '3 queries > 2s', time: '8s ago' },
      { dot: 'dot-r', name: 'redis — OOM warning', sub: 'maxmemory 94%', time: '22s ago' },
    ],
  },
  'Team Status': {
    cards: [
      { label: 'On-Call Now', val: '2', bar: 40 },
      { label: 'Avg Response', val: '3.2m', bar: 60 },
    ],
    items: [
      { dot: 'dot-g', name: 'Aisha Rahman', sub: 'Active — owns AUTH-441', time: 'online' },
      { dot: 'dot-g', name: 'Marcus Lee', sub: 'Active — DB investigation', time: 'online' },
      { dot: 'dot-y', name: 'Sara Diaz', sub: 'Idle — available', time: '2m ago' },
    ],
  },
};

const UnifiedCommand = () => {
  const [tab, setTab] = useState('Timeline View');
  const data = mockData[tab];

  return (
    <section className="command">
      <div className="command-inner">
        <span className="tag">The Control Center</span>
        <h2 className="section-h">
          Unified <em className="grad-text">Incident Command</em>
        </h2>

        <div className="tabs">
          {Object.keys(tabs).map((t) => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
              {tab === t && <motion.div layoutId="tab-bg" className="tab-bg" />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={tab}
            className="tab-desc"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            {tabs[tab]}
          </motion.p>
        </AnimatePresence>

        <div className="cmd-frame">
          <div className="frame-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="frame-body">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                className="mock-ui"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mock-row">
                  <div className="mock-card-container">
                    {data.cards.map((c, i) => (
                      <div key={i} className="mock-card">
                        <div className="mock-label">{c.label}</div>
                        <div className="mock-val">{c.val}</div>
                        <div className="mock-bar">
                          <div className="fill" style={{ width: `${c.bar}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mock-list">
                    {data.items.map((item, i) => (
                      <div key={i} className="mock-item">
                        <div className={`dot ${item.dot}`} />
                        <div className="item-info">
                          <div className="item-name">{item.name}</div>
                          <div className="item-sub">{item.sub}</div>
                        </div>
                        <div className="item-time">{item.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnifiedCommand;
