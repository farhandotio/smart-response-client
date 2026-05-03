import { motion } from 'framer-motion';
import { Shield, Cloud, Cpu, Zap, Activity } from 'lucide-react';

const logos = [
  { name: 'CYBERSEC', icon: <Shield size={14} /> },
  { name: 'CLOUDOPS', icon: <Cloud size={14} /> },
  { name: 'NEXUS', icon: <Cpu size={14} /> },
  { name: 'VOLT', icon: <Zap size={14} /> },
  { name: 'DATAFLOW', icon: <Activity size={14} /> },
];

const TrustedBy = () => (
  <section className="trusted">
    <div className="trusted-inner">
      <motion.p
        className="trusted-label"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Trusted by security &amp; infrastructure leaders
      </motion.p>
      <motion.div
        className="logos"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.07 }}
      >
        {logos.map((l, i) => (
          <motion.div
            key={i}
            className="logo-item"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            {l.icon}
            <span>{l.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default TrustedBy;
