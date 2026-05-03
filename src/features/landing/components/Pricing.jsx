import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Free',
    monthly: '$0',
    annual: '$0',
    freq: '/forever',
    desc: 'Get started with basic incident tracking. No credit card required.',
    feats: ['Basic incident tracking', 'Up to 1 user', 'Manual alerts', 'Email support'],
  },
  {
    name: 'Starter',
    monthly: '$49',
    annual: '$39',
    freq: '/month',
    desc: 'Ideal for small security teams starting with incident response.',
    feats: [
      'Basic incident workflows',
      'Up to 3 users',
      'Email & Slack alerts',
      'Standard reporting',
    ],
  },
  {
    name: 'Professional',
    monthly: '$149',
    annual: '$119',
    freq: '/month',
    desc: 'Best for growing teams needing automation and SLA tracking.',
    feats: [
      'Advanced orchestration',
      'Up to 10 users',
      'AI-assisted investigation',
      'Priority support',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    monthly: 'Custom',
    annual: 'Custom',
    freq: '',
    desc: 'Custom plans for large teams with dedicated onboarding support.',
    feats: ['Unlimited users', 'Custom integrations', 'Dedicated onboarding', '24/7 IR support'],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const card = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const Pricing = () => {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="pricing" id="pricing">
      <div className="section-hd">
        <span className="tag">Pricing</span>
        <h2 className="section-h">
          Simple, <em className="grad-text">Transparent</em> Pricing
        </h2>
        <p className="section-sub">
          Choose the plan that fits your team. Scale up anytime, cancel anytime.
        </p>

        <div className="billing-toggle">
          <span className={!annual ? 'on' : ''}>Monthly</span>
          <div
            className={`toggle ${annual ? 'on' : ''}`}
            onClick={() => setAnnual(!annual)}
            role="switch"
            aria-checked={annual}
          >
            <div className="thumb" />
          </div>
          <span className={annual ? 'on' : ''}>Annual</span>
          <span className="save-tag">Save 20%</span>
        </div>
      </div>

      <motion.div
        className="plan-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        {plans.map((p) => (
          <motion.div
            key={p.name}
            className={`plan ${p.popular ? 'popular' : ''}`}
            variants={card}
            whileHover={{ y: -5 }}
          >
            {p.popular && <div className="pop-tag">Popular</div>}

            <div className="plan-name">{p.name}</div>

            <div className="plan-price">
              <strong>{p.monthly === 'Custom' ? 'Custom' : annual ? p.annual : p.monthly}</strong>
              {p.freq && <span>{p.freq}</span>}
            </div>

            <p className="plan-desc">{p.desc}</p>

            <div className="plan-div" />

            <ul className="plan-feats">
              {p.feats.map((f) => (
                <li key={f}>
                  <span className="chk" />
                  {f}
                </li>
              ))}
            </ul>

            {p.name === 'Enterprise' ? (
              <a href="mailto:sales@sirp.io" className="plan-btn">
                Talk to Sales
              </a>
            ) : (
              <Link to="/register" className={`plan-btn ${p.popular ? 'pri' : ''}`}>
                {p.name === 'Free' ? 'Get Started Free' : 'Start Free Trial'}
              </Link>
            )}
          </motion.div>
        ))}
      </motion.div>

      <p className="pricing-note">
        All plans include a 14-day free trial. No credit card required.{' '}
        <a href="mailto:sales@sirp.io">Contact sales</a> for volume discounts.
      </p>
    </section>
  );
};

export default Pricing;
