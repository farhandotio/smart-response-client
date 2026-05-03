import { motion } from 'framer-motion';
import { Users, Cpu, Eye, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: <Users size={18} />,
    title: 'Tactical Collaboration',
    desc: 'Real-time sync for engineering teams. Coordinate with sub-second latency powered by Socket.io.',
  },
  {
    icon: <Cpu size={18} />,
    title: 'AI Diagnostic Engine',
    desc: 'Leverage Gemini 1.5 Pro to analyze logs instantly. Identify root causes before your team starts digging.',
  },
  {
    icon: <Eye size={18} />,
    title: 'Unified Monitoring',
    desc: 'Centralize logs from VPS, Cloud, or Serverless. One command center to monitor your entire infrastructure.',
  },
  {
    icon: <ShieldCheck size={18} />,
    title: 'Enterprise Security',
    desc: 'End-to-end encryption for all log data. Built-in compliance tools and audit trails for every incident.',
  },
  {
    icon: <Zap size={18} />,
    title: 'Automated Workflows',
    desc: 'Trigger automated postmortems and status updates. Reduce MTTR by automating repetitive response tasks.',
  },
  {
    icon: <BarChart3 size={18} />,
    title: 'System Intelligence',
    desc: 'Deep analytics on incident trends. Identify weak points with AI-generated infrastructure health reports.',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const Features = () => (
  <section className="features" id="features">
    <div className="section-hd">
      <span className="tag">Core Capabilities</span>
      <h2 className="section-h">
        Engineered for <em>High-Availability</em>
      </h2>
      <p className="section-sub">
        Everything you need to master infrastructure chaos and build unshakable trust with your
        customers.
      </p>
    </div>

    <motion.div
      className="feat-grid"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {features.map((f, i) => (
        <motion.div key={i} className="feat-card" variants={item} whileHover={{ y: -4 }}>
          <div className="feat-icon">{f.icon}</div>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

export default Features;
